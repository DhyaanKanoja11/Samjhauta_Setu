import re

SUPPORTED_CROPS = {
    "wheat": ["wheat", "गेहूं", "ઘઉં"],
    "rice": ["rice", "चावल", "ચોખા"],
    "cotton": ["cotton", "कपास", "કપાસ"],
    "apple": ["apple", "सेब", "સફરજન"]
}

SCHEME_KEYWORDS = ["pm kisan", "किसान योजना", "યોજના"]

def detect_intent(text):
    text_lower = text.lower()

    # Greeting
    if any(word in text_lower for word in ["hello", "hi", "नमस्ते", "નમસ્તે"]):
        return "greeting"

    # Weather
    if "weather" in text_lower or "मौसम" in text_lower or "હવામાન" in text_lower:
        return "weather"

    # Scheme
    if any(word in text_lower for word in SCHEME_KEYWORDS):
        return "scheme"

    # Legal
    if "contract" in text_lower or "विवाद" in text_lower:
        return "legal_help"

    # Crop price
    for crop, keywords in SUPPORTED_CROPS.items():
        for keyword in keywords:
            if keyword in text_lower:
                return "mandi_price"

    return "fallback"


def extract_crop(text):
    text_lower = text.lower()
    for crop, keywords in SUPPORTED_CROPS.items():
        for keyword in keywords:
            if keyword in text_lower:
                return crop
    return None