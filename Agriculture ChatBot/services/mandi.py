import os
import json
import requests
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from functools import lru_cache

MANDI_RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070"
CACHE_FILE = "mandi_cache.json"
CACHE_DURATION = timedelta(hours=24)
DATA_GOV_API_KEY = os.environ.get("DATA_GOV_API_KEY", "")

def fetch_state_records(state: str) -> List[Dict[str, Any]]:
    # 1. Check local cache
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r") as f:
                cache_data = json.load(f)
            state_cache = cache_data.get(state)
            if state_cache:
                last_updated = datetime.fromisoformat(state_cache["timestamp"])
                if datetime.utcnow() - last_updated < CACHE_DURATION:
                    return state_cache["data"]
        except:
            pass

    # 2. Fetch fresh from API
    url = f"https://api.data.gov.in/resource/{MANDI_RESOURCE_ID}"
    params = {
        "api-key": DATA_GOV_API_KEY,
        "format": "json",
        "limit": 500,
        "filters[state]": state
    }

    try:
        r = requests.get(url, params=params, timeout=15)
        if r.status_code != 200: return []
        records = r.json().get("records", [])

        # 3. Update cache
        cache_data = {}
        if os.path.exists(CACHE_FILE):
            try:
                with open(CACHE_FILE, "r") as f: cache_data = json.load(f)
            except: pass
        
        cache_data[state] = {
            "timestamp": datetime.utcnow().isoformat(),
            "data": records
        }
        with open(CACHE_FILE, "w") as f: json.dump(cache_data, f)
        
        return records
    except:
        return []

def fetch_market_records(state: str, market: str) -> List[Dict[str, Any]]:
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
        if r.status_code == 200: return r.json().get("records", [])
    except:
        pass
    return []

def get_top_commodities(state: str) -> List[Dict[str, Any]]:
    records = fetch_state_records(state)
    if not records: return []
    
    commodity_prices = {}
    for r in records:
        commodity = r.get("commodity")
        modal = r.get("modal_price")
        if not commodity or not modal: continue
        try:
            modal = float(modal)
            if commodity not in commodity_prices: commodity_prices[commodity] = []
            commodity_prices[commodity].append(modal)
        except: continue

    result = []
    for comm, prices in commodity_prices.items():
        avg = round(sum(prices)/len(prices), 2)
        result.append({"crop": comm, "price": avg, "unit": "₹/quintal"})
    
    return sorted(result, key=lambda x: x["price"], reverse=True)[:10]

def detect_state(text: str) -> Optional[str]:
    states = ["Punjab", "Rajasthan", "Gujarat", "Haryana", "Maharashtra", "Uttar Pradesh"]
    for s in states:
        if s.lower() in text.lower(): return s
    return None

def get_markets(records: List[Dict[str, Any]]) -> List[str]:
    return sorted(list(set(r.get("market") for r in records if r.get("market"))))

def get_commodities(records: List[Dict[str, Any]]) -> List[str]:
    return sorted(list(set(r.get("commodity") for r in records if r.get("commodity"))))
