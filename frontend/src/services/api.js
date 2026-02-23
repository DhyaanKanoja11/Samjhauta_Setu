import axios from "axios";

/*
  Vercel Environment Variables:
  VITE_API_URL_CHATBOT
  VITE_API_URL_OCR
*/

const BASE_URL_CHATBOT = import.meta.env.VITE_API_URL_CHATBOT;
const BASE_URL_OCR = import.meta.env.VITE_API_URL_OCR;

// Normalize: remove trailing slash (avoids //route issues)
const normalize = (url) => (url ? url.replace(/\/+$/, "") : "");

const CHATBOT_API = axios.create({
  baseURL: normalize(BASE_URL_CHATBOT),
  timeout: 60000, // ✅ 60s for Render cold starts
});

const OCR_API = axios.create({
  baseURL: normalize(BASE_URL_OCR),
  timeout: 60000, // ✅ 60s for Render cold starts
});

// -----------------------------
// Warm-up (Render sleep fix)
// -----------------------------
export const warmUp = async () => {
  const results = await Promise.allSettled([
    CHATBOT_API.get("/"),
    OCR_API.get("/"),
  ]);

  return {
    chatbot: results[0].status,
    ocr: results[1].status,
  };
};

// ==============================
// OCR / Document APIs
// ==============================
export const scanDocument = async (file, lang = "hi") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("lang", lang);

  const res = await OCR_API.post("/scan", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const analyzeText = async (text, lang = "hi") => {
  const res = await OCR_API.post("/analyze", { text, lang });
  return res.data;
};

// ==============================
// Chatbot APIs
// ==============================
export const chatWithBot = async (text) => {
  const res = await CHATBOT_API.post("/chat", { text });
  return res.data;
};

export const chatWithBotAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "voice.webm");

  const res = await CHATBOT_API.post("/chat", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const chatWithWeather = async (lat, lon) => {
  const res = await CHATBOT_API.post("/chat", {
    text: "weather",
    lat,
    lon,
  });
  return res.data;
};

// ==============================
// PIB News
// IMPORTANT: Your /pib-news is in app.py (chatbot backend)
// ==============================
export const getPIBNews = async (count = 10) => {
  const res = await CHATBOT_API.get(`/pib-news?count=${count}`);
  return res.data;
};

// ==============================
// Mandi
// ==============================
export const getTopCommodities = async (state = "Punjab") => {
  const res = await CHATBOT_API.get(`/top-commodities?state=${state}`);
  return res.data;
};