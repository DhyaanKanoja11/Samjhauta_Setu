import axios from "axios";

// Environment-based API URLs with fallbacks
const BASE_URL_OCR = import.meta.env.VITE_API_URL_OCR || "http://localhost:5000";
const BASE_URL_CHATBOT = import.meta.env.VITE_API_URL_CHATBOT || "http://localhost:5001";

// Primary backend (OCR / Risk Engine)
const BASE_API = axios.create({
  baseURL: BASE_URL_OCR,
  timeout: 30000, // 30 seconds for OCR processing
});

// Agriculture ChatBot backend
const CHATBOT_API = axios.create({
  baseURL: BASE_URL_CHATBOT,
  timeout: 15000, // 15 seconds for chat responses
});

export const scanDocument = async (file, lang = 'hi') => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("lang", lang);

  const response = await BASE_API.post("/scan", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const analyzeText = async (text, lang = 'hi') => {
  const response = await BASE_API.post("/analyze", { text, lang });
  return response.data;
};

export const chatWithBot = async (text) => {
  const formData = new FormData();
  formData.append("text", text);
  const response = await CHATBOT_API.post("/chat", formData);
  return response.data;
};

export const chatWithBotAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "user_voice.webm");
  const response = await CHATBOT_API.post("/chat", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
