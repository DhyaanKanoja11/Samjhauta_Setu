import axios from "axios";

/*
  Vercel Environment Variables:
  VITE_API_URL_CHATBOT
  VITE_API_URL_OCR
*/

// -----------------------------
// Base URLs
// -----------------------------
const normalize = (url) => (url ? url.replace(/\/+$/, "") : "");

const BASE_URL_CHATBOT = normalize(import.meta.env.VITE_API_URL_CHATBOT);
const BASE_URL_OCR = normalize(import.meta.env.VITE_API_URL_OCR);

// Safety check (helps debugging in production)
if (!BASE_URL_CHATBOT) {
  console.error("❌ VITE_API_URL_CHATBOT is not defined");
}
if (!BASE_URL_OCR) {
  console.error("❌ VITE_API_URL_OCR is not defined");
}

// -----------------------------
// Axios Instances
// -----------------------------
const CHATBOT_API = axios.create({
  baseURL: BASE_URL_CHATBOT,
  timeout: 60000, // 60s for Render cold starts
});

const OCR_API = axios.create({
  baseURL: BASE_URL_OCR,
  timeout: 60000,
});

// -----------------------------
// Warm-up (Render sleep fix)
// -----------------------------
export const warmUp = async () => {
  try {
    await Promise.allSettled([
      CHATBOT_API.get("/"),
      OCR_API.get("/"),
    ]);
  } catch {
    // silent fail — warmup should never crash UI
  }
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
// ==============================
export const getPIBNews = async (count = 10) => {
  const res = await CHATBOT_API.get("/pib-news", {
    params: { count },
  });
  return res.data;
};

// ==============================
// Mandi (Important Fix Here)
// ==============================
export const getTopCommodities = async (state = "Punjab") => {
  const res = await CHATBOT_API.get("/top-commodities", {
    params: { state },   // ✅ safer than string interpolation
  });

  return res.data;
};