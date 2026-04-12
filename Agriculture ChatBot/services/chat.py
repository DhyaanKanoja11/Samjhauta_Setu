from typing import Dict, Any, Tuple, Optional
from .mandi import detect_state, fetch_state_records, get_markets, fetch_market_records, get_commodities
from .weather import get_weather
from .llm_service import llm_service

def get_chat_response(
    question: str,
    lang: str,
    context: Dict[str, Any],
    lat: Optional[float] = None,
    lon: Optional[float] = None
) -> Tuple[str, int]:
    
    q = question.strip().lower()

    # 1. Weather Logic
    if any(word in q for word in ["weather", "मौसम", "mausam", "હવામાન"]):
        if not lat or not lon:
            msg = {"en": "Need location for weather.", "hi": "मौसम के लिए लोकेशन चाहिए।", "gu": "હવામાન માટે લોકેશન જોઈએ."}
            return msg.get(lang, msg["en"]), 200
        return get_weather(lat, lon), 200

    # 2. State Detection for Mandi
    state = detect_state(q)
    if state:
        context["state"] = state
        context["market"] = None
        records = fetch_state_records(state)
        markets = get_markets(records)
        if not markets: return f"No markets found in {state}.", 200
        
        msg = f"{state} Top Markets:\n" + "\n".join([f"- {m}" for m in markets[:10]])
        return msg + "\n\nPlease type a market name.", 200

    # 3. Market Detection
    if context.get("state"):
        state_ctx = context["state"]
        records = fetch_state_records(state_ctx)
        markets = get_markets(records)
        for m in markets:
            if m.lower() in q:
                context["market"] = m
                m_records = fetch_market_records(state_ctx, m)
                comms = get_commodities(m_records)
                msg = f"Crops in {m}:\n" + "\n".join([f"- {c}" for c in comms])
                return msg + "\n\nType crop name for price.", 200

    # 4. LLM Fallback
    response = llm_service.get_response(question, lang)
    return response, 200
