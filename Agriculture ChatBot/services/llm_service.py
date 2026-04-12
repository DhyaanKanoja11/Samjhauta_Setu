import os
import google.generativeai as genai
from typing import Optional

class LLMService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    def get_response(self, question: str, lang: str = "en") -> str:
        if not self.model:
            return self._get_fallback(lang)

        prompt = f"You are an expert agriculture and legal assistant for Indian farmers. Answer the following question in the language '{lang}': {question}"
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return self._get_fallback(lang)

    def _get_fallback(self, lang: str) -> str:
        fallbacks = {
            "en": "I am here to help you with farming and legal queries. (Gemini API not connected)",
            "hi": "मैं आपकी खेती और कानूनी पूछताछ में मदद करने के लिए यहाँ हूँ। (Gemini API कनेक्ट नहीं है)",
            "gu": "હું તમારી ખેતી અને કાનૂની પૂછપરછમાં મદદ કરવા માટે અહીં છું. (Gemini API કનેક્ટ નથી)"
        }
        return fallbacks.get(lang, fallbacks["en"])

llm_service = LLMService()
