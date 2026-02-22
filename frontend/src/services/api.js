import axios from "axios";

/*
  Environment variables from Vercel:
  VITE_API_URL_CHATBOT
  VITE_API_URL_OCR
*/

const BASE_URL_CHATBOT = import.meta.env.VITE_API_URL_CHATBOT;
const BASE_URL_OCR = import.meta.env.VITE_API_URL_OCR;

// Safety fallback (optional for local dev only)
const CHATBOT_API = axios.create({
  baseURL: BASE_URL_CHATBOT,
  timeout: 20000,
});

const OCR_API = axios.create({
  baseURL: BASE_URL_OCR,
  timeout: 30000,
});

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
// Chatbot API
// ==============================

export const chatWithBot = async (payload) => {
  const res = await CHATBOT_API.post("/chat", payload);
  return res.data;
};

// ==============================
// PIB News
// ==============================

export const getPIBNews = async (count = 10) => {
  const res = await OCR_API.get(`/pib-news?count=${count}`);
  return res.data;
};

// ==============================
// Mandi Top Commodities
// ==============================

export const getTopCommodities = async (state = "Punjab") => {
  const res = await CHATBOT_API.get(`/top-commodities?state=${state}`);
  return res.data;
};