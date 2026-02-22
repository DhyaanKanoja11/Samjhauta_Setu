import axios from "axios";

// Environment-based API URLs with fallbacks
const BASE_URL_OCR = import.meta.env.VITE_API_URL_OCR;
const BASE_URL_CHATBOT = import.meta.env.VITE_API_URL_CHATBOT;
// Primary backend (OCR / Risk Engine)
const BASE_API = axios.create({
  baseURL: BASE_URL_OCR,
  timeout: 30000,
});

// Agriculture ChatBot backend
const CHATBOT_API = axios.create({
  baseURL: BASE_URL_CHATBOT,
  timeout: 15000,
});

export const scanDocument = async (file, lang = "hi") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("lang", lang);

  const response = await BASE_API.post("/scan", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const analyzeText = async (text, lang = "hi") => {
  const response = await BASE_API.post("/analyze", { text, lang });
  return response.data;
};

// Text chat
export const chatWithBot = async (text) => {
  const formData = new FormData();
  formData.append("text", text);

  const response = await CHATBOT_API.post("/chat", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

// Audio chat
export const chatWithBotAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "user_voice.webm");

  const response = await CHATBOT_API.post("/chat", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

// Weather (text + location)
export const chatWithWeather = async (text, lat, lon) => {
  const formData = new FormData();
  formData.append("text", text);
  formData.append("lat", String(lat));
  formData.append("lon", String(lon));

  const response = await CHATBOT_API.post("/chat", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

// Optional: reset state/market context
export const resetChatbotContext = async () => {
  const response = await CHATBOT_API.post("/reset");
  return response.data;
};