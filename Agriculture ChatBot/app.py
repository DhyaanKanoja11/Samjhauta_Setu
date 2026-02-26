import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from functools import lru_cache
from datetime import datetime
from bs4 import BeautifulSoup
from xml.etree import ElementTree as ET
import time
from math import floor
load_dotenv()

app = Flask(__name__)

# For local dev keep open. For deployment tighten allowed origins.
CORS(app)

DATA_GOV_API_KEY = os.environ.get("DATA_GOV_API_KEY", "")
MANDI_RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070"
SUPPORTED_STATES = ["Punjab", "Rajasthan", "Gujarat"]
WEATHER_CACHE = {}
WEATHER_TTL = 300  # 5 minutes
# Simple per-IP in-memory context
USER_CONTEXT = {}

# -----------------------------------------------------
# PIB NEWS (Scrape + RSS fallback)
# -----------------------------------------------------
# -----------------------------------------------------
# PIB NEWS (Google RSS first → PIB scrape fallback)
# -----------------------------------------------------
HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/xml,text/html",
    "Accept-Language": "en-US,en;q=0.9",
}

@app.route("/pib-news", methods=["GET"])
def pib_news():
    count = int(request.args.get("count", 10))
    news_list = []

    # ------------------------------
    # 1️⃣ Google News RSS (Primary - Most Stable)
    # ------------------------------
    try:
        rss_url = "https://news.google.com/rss/search?q=Department+Agriculture+Farmers+Welfare+India+government&hl=en-IN&gl=IN&ceid=IN:en"
        rss_response = requests.get(rss_url, headers=HEADERS, timeout=10)

        if rss_response.status_code == 200:
            root = ET.fromstring(rss_response.content)

            for item in root.findall(".//item")[:count]:
                title = item.findtext("title", "")
                link = item.findtext("link", "")
                pub_date = item.findtext("pubDate", datetime.now().strftime("%a, %d %b %Y"))

                if title:
                    news_list.append({
                        "title": title,
                        "link": link,
                        "published": pub_date
                    })

        # If RSS worked, return immediately
        if news_list:
            return jsonify({
                "status": "success",
                "source": "google-rss",
                "total": len(news_list),
                "news": news_list
            })

    except Exception as e:
        print("Google RSS error:", e)

    # ------------------------------
    # 2️⃣ PIB Website Scrape (Fallback)
    # ------------------------------
    try:
        url = "https://pib.gov.in/allRel.aspx"
        response = requests.get(url, headers=HEADERS, timeout=15)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")

            for item in soup.select("ul.release-list li, .all-release li")[:count]:
                title_tag = item.find("a")
                if not title_tag:
                    continue

                title = title_tag.get_text(strip=True)
                link = title_tag.get("href", "")

                if link and not link.startswith("http"):
                    link = "https://pib.gov.in/" + link.lstrip("/")

                if title:
                    news_list.append({
                        "title": title,
                        "link": link,
                        "published": datetime.now().strftime("%d %b %Y")
                    })

        if news_list:
            return jsonify({
                "status": "success",
                "source": "pib-scrape",
                "total": len(news_list),
                "news": news_list
            })

    except Exception as e:
        print("PIB scrape error:", e)

    # ------------------------------
    # 3️⃣ Final fallback
    # ------------------------------
    return jsonify({
        "status": "error",
        "message": "Could not fetch agriculture news at this time.",
        "news": []
    }), 503
@app.route("/top-commodities", methods=["GET"])
def top_commodities():
    state = request.args.get("state", "Punjab")

    records = fetch_state_records(state)

    if not records:
        return jsonify({"data": []})

    commodity_prices = {}

    for r in records:
        commodity = r.get("commodity")
        modal = r.get("modal_price")

        if not commodity or not modal:
            continue

        try:
            modal = float(modal)
        except:
            continue

        if commodity not in commodity_prices:
            commodity_prices[commodity] = []

        commodity_prices[commodity].append(modal)

    result = []

    for commodity, prices in commodity_prices.items():
        avg_price = round(sum(prices) / len(prices), 2)

        result.append({
            "crop": commodity,
            "price": avg_price,
            "unit": "₹/quintal"
        })

    # Sort highest price first
    result = sorted(result, key=lambda x: x["price"], reverse=True)

    # Top 10
    return jsonify({"data": result[:10]})
# -----------------------------------------------------
# FREE WEATHER (Open-Meteo) - NO API KEY
# -----------------------------------------------------
def get_weather(lat, lon):
    try:
        url = f"https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "current_weather": True
        }

        r = requests.get(url, params=params, timeout=10)

        if r.status_code != 200:
            return "Weather service unavailable."

        data = r.json()
        current = data.get("current_weather", {})

        temp = current.get("temperature")
        wind = current.get("windspeed")

        advisory = "Normal farming conditions."
        if temp and temp >= 35:
            advisory = "High temperature. Increase irrigation."
        elif wind and wind >= 25:
            advisory = "High wind speed. Avoid spraying chemicals."

        return f"""
🌦 Current Weather

Temperature: {temp}°C
Wind Speed: {wind} km/h

🌾 Advisory:
{advisory}
"""
    except Exception as e:
        return f"Weather Error: {str(e)}"
# -----------------------------------------------------
# MANDI API (Data.gov) - Cached
# -----------------------------------------------------
@lru_cache(maxsize=50)
def fetch_state_records(state):
    url = f"https://api.data.gov.in/resource/{MANDI_RESOURCE_ID}"

    params = {
        "api-key": DATA_GOV_API_KEY,
        "format": "json",
        "limit": 1000,
        "filters[state]": state  # ✅ API-side filtering (FIXED)
    }

    try:
        r = requests.get(url, params=params, timeout=20)

        if r.status_code != 200:
            print("Data.gov HTTP Error:", r.status_code)
            return []

        records = r.json().get("records", [])

        print(f"Fetched {len(records)} mandi records for {state}")

        return records

    except Exception as e:
        print("API Error:", e)
        return []

@lru_cache(maxsize=200)
def fetch_market_records(state, market):
    url = f"https://api.data.gov.in/resource/{MANDI_RESOURCE_ID}"
    params = {
        "api-key": DATA_GOV_API_KEY,
        "format": "json",
        "limit": 500,
        "filters[state]": state,
        "filters[market]": market
    }
    try:
        r = requests.get(url, params=params, timeout=15)
        if r.status_code == 200:
            return r.json().get("records", [])
    except Exception as e:
        print("Market API Error:", e)
    return []

def detect_state(text):
    for state in SUPPORTED_STATES:
        if state.lower() in text.lower():
            return state
    return None

def get_markets(records):
    return sorted(set(r.get("market") for r in records if r.get("market")))

def get_commodities(records):
    return sorted(set(r.get("commodity") for r in records if r.get("commodity")))


# -----------------------------------------------------
# ROUTES
# -----------------------------------------------------
@app.route("/")
def home():
    return "Main Backend Running (Chat + Mandi + Weather + PIB)"

@app.route("/reset", methods=["POST"])
def reset():
    user_ip = request.remote_addr
    USER_CONTEXT[user_ip] = {"state": None, "market": None}
    return jsonify({"text": "Context reset."})

@app.route("/chat", methods=["POST"])
def chat():
    question = request.form.get("text") or (request.json.get("text") if request.is_json else None)
    lang = request.form.get("lang") or (request.json.get("lang") if request.is_json else "hi")

    if not question:
        return jsonify({"text": "No query provided"}), 400

    q = question.strip()
    user_ip = request.remote_addr

    if user_ip not in USER_CONTEXT:
        USER_CONTEXT[user_ip] = {"state": None, "market": None}
    context = USER_CONTEXT[user_ip]

    # -----------------------------
    # 🌦 WEATHER
    # -----------------------------
    if ("weather" in q.lower()) or ("मौसम" in q) or ("mausam" in q.lower()) or ("હવામાન" in q):
        lat = request.form.get("lat") or (request.json.get("lat") if request.is_json else None)
        lon = request.form.get("lon") or (request.json.get("lon") if request.is_json else None)

        if not lat or not lon:
            msg = {
                "en": "Please allow location access to fetch weather.",
                "hi": "मौसम जानने के लिए कृपया लोकेशन की अनुमति दें।",
                "gu": "હવામાન જાણવા માટે કૃપા કરીને લોકેશન પરવાનગી આપો."
            }
            return jsonify({"text": msg.get(lang, msg["hi"])})

        weather_text = get_weather(lat, lon)

        return jsonify({"text": weather_text})

    # -----------------------------
    # 🏛 STATE DETECTION
    # -----------------------------
    state = detect_state(q)
    if state:
        context["state"] = state
        context["market"] = None

        records = fetch_state_records(state)
        if not records:
            return jsonify({"text": f"No mandi data found for {state}."})

        markets = get_markets(records)
        if not markets:
            return jsonify({"text": f"No markets found for {state}."})

        if lang == "gu":
            msg = f"{state} માં ટોચની મંડીઓ:\n\n"
        elif lang == "en":
            msg = f"Top markets in {state}:\n\n"
        else:
            msg = f"{state} में प्रमुख मंडियां:\n\n"

        for i, m in enumerate(markets[:15], 1):
            msg += f"{i}. {m}\n"

        if lang == "gu":
            msg += "\nકૃપા કરીને માર્કેટનું નામ લખો."
        elif lang == "en":
            msg += "\nPlease type the market name."
        else:
            msg += "\nकृपया मंडी का नाम लिखें।"

        return jsonify({"text": msg})

    # -----------------------------
    # 🏬 MARKET DETECTION
    # -----------------------------
    if context["state"]:
        state = context["state"]
        state_records = fetch_state_records(state)
        markets = get_markets(state_records)

        for market in markets:
            if market.lower() in q.lower():
                context["market"] = market
                market_records = fetch_market_records(state, market)
                commodities = get_commodities(market_records)

                if not commodities:
                    return jsonify({"text": f"No commodities found in {market}."})

                if lang == "gu":
                    msg = f"{market} માં ઉપલબ્ધ પાકો:\n\n"
                elif lang == "en":
                    msg = f"Available commodities in {market}:\n\n"
                else:
                    msg = f"{market} में उपलब्ध फसलें:\n\n"

                for c in commodities:
                    msg += f"- {c}\n"

                if lang == "gu":
                    msg += "\nકૃપા કરીને પાકનું નામ લખો."
                elif lang == "en":
                    msg += "\nPlease type commodity name."
                else:
                    msg += "\nकृपया फसल का नाम लिखें।"

                return jsonify({"text": msg})

    # -----------------------------
    # 🌾 COMMODITY PRICE
    # -----------------------------
    if context["state"] and context["market"]:
        state = context["state"]
        market = context["market"]
        market_records = fetch_market_records(state, market)

        for r in market_records:
            commodity = (r.get("commodity") or "").strip()
            if commodity and commodity.lower() in q.lower():
                if lang == "gu":
                    msg = f"""📊 {commodity} નો ભાવ ({market}, {state}):

ન્યૂનતમ ભાવ: ₹{r.get('min_price')}
મહત્તમ ભાવ: ₹{r.get('max_price')}
મોડલ ભાવ: ₹{r.get('modal_price')}
તારીખ: {r.get('arrival_date')}
"""
                elif lang == "en":
                    msg = f"""📊 Price breakdown for {commodity} in {market} ({state}):

Minimum Price: ₹{r.get('min_price')}
Maximum Price: ₹{r.get('max_price')}
Modal Price: ₹{r.get('modal_price')}
Arrival Date: {r.get('arrival_date')}
"""
                else:
                    msg = f"""📊 {commodity} का भाव ({market}, {state}):

न्यूनतम मूल्य: ₹{r.get('min_price')}
अधिकतम मूल्य: ₹{r.get('max_price')}
मोडल मूल्य: ₹{r.get('modal_price')}
तारीख: {r.get('arrival_date')}
"""

                return jsonify({"text": msg})

    # -----------------------------
    # 🔁 FALLBACK
    # -----------------------------
    fallback = {
        "en": "Start with: Punjab mandi / Rajasthan mandi / Gujarat mandi OR type: weather",
        "hi": "शुरू करें: Punjab mandi / Rajasthan mandi / Gujarat mandi या 'weather' लिखें।",
        "gu": "શરૂ કરો: Punjab mandi / Rajasthan mandi / Gujarat mandi અથવા 'weather' લખો."
    }

    return jsonify({"text": fallback.get(lang, fallback["hi"])})
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)