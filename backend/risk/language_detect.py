# risk/language_detect.py

from langdetect import detect

SUPPORTED_LANGUAGES = ["en", "hi", "gu", "pa", "kn"]


def detect_language(text):
    try:
        lang = detect(text)
        if lang in SUPPORTED_LANGUAGES:
            return lang
        return "en"
    except:
        return "en"
