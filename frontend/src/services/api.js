import axios from "axios";

const normalize = (url) => (url ? url.replace(/\/+$/, "") : "");

// Environment URLs
const BASE_URL_CHATBOT = normalize(import.meta.env.VITE_API_URL_CHATBOT);
const BASE_URL_OCR = normalize(import.meta.env.VITE_API_URL_OCR);

// Axios instances
const CHATBOT_API = axios.create({
  baseURL: BASE_URL_CHATBOT,
  timeout: 60000,
});

const OCR_API = axios.create({
  baseURL: BASE_URL_OCR,
  timeout: 60000,
});

// 🔥 Get selected language safely
const getSelectedLanguage = () => {
  return localStorage.getItem("selectedLanguage") || "hi";
};

// 🔥 Warm up backend
export const warmUp = async () => {
  try {
    await Promise.allSettled([
      CHATBOT_API.get("/"),
      OCR_API.get("/"),
    ]);
  } catch (err) {
    console.warn("Warmup failed:", err);
  }
};

// 📄 Scan Document
export const scanDocument = async (file, lang = getSelectedLanguage()) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("lang", lang);

  const res = await OCR_API.post("/scan", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// 📝 Analyze Text
export const analyzeText = async (text, lang = getSelectedLanguage()) => {
  const res = await OCR_API.post("/analyze", {
    text,
    lang,
  });

  return res.data;
};

// 💬 Chat with Bot (Text)
export const chatWithBot = async (text) => {
  const res = await CHATBOT_API.post("/chat", {
    text,
    lang: getSelectedLanguage(),
  });

  return res.data;
};

// 🎤 Chat with Bot (Audio)
export const chatWithBotAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "voice.webm");
  formData.append("lang", getSelectedLanguage());

  const res = await CHATBOT_API.post("/chat", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// 🌤 Weather Chat
export const chatWithWeather = async (lat, lon) => {
  const res = await CHATBOT_API.post("/chat", {
    text: "weather",
    lat,
    lon,
    lang: getSelectedLanguage(),
  });

  return res.data;
};

// 📰 PIB News
export const getPIBNews = async (count = 10) => {
  const res = await CHATBOT_API.get("/pib-news", {
    params: { count },
  });

  return res.data;
};

// 🌾 Top Commodities
export const getTopCommodities = async (state = "Punjab") => {
  const res = await CHATBOT_API.get("/top-commodities", {
    params: { state },
  });

  return res.data;
};