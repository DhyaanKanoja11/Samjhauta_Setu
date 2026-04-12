import requests
from bs4 import BeautifulSoup
from xml.etree import ElementTree as ET
from datetime import datetime
from typing import List, Dict, Any

HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/xml,text/html",
}

def get_pib_news(count: int = 10) -> Dict[str, Any]:
    news_list = []

    # 1. Google News RSS
    try:
        rss_url = "https://news.google.com/rss/search?q=Department+Agriculture+Farmers+Welfare+India+government&hl=en-IN&gl=IN&ceid=IN:en"
        r = requests.get(rss_url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            root = ET.fromstring(r.content)
            for item in root.findall(".//item")[:count]:
                news_list.append({
                    "title": item.findtext("title", ""),
                    "link": item.findtext("link", ""),
                    "published": item.findtext("pubDate", "")
                })
        if news_list:
            return {"status": "success", "source": "google-rss", "news": news_list}
    except:
        pass

    # 2. PIB Fallback
    try:
        url = "https://pib.gov.in/allRel.aspx"
        r = requests.get(url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            for item in soup.select("ul.release-list li, .all-release li")[:count]:
                tag = item.find("a")
                if tag:
                    link = tag.get("href", "")
                    if not link.startswith("http"): link = "https://pib.gov.in/" + link.lstrip("/")
                    news_list.append({
                        "title": tag.get_text(strip=True),
                        "link": link,
                        "published": datetime.now().strftime("%d %b %Y")
                    })
        if news_list:
            return {"status": "success", "source": "pib-scrape", "news": news_list}
    except:
        pass

    return {"status": "error", "message": "News unavailable", "news": []}
