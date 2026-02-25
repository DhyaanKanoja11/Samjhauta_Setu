import axios from "axios";
import i18n from "../i18n";

const normalize = (url) => (url ? url.replace(/\/+$/, "") : "");

const BASE_URL_CHATBOT = normalize(import.meta.env.VITE_API_URL_CHATBOT);
const BASE_URL_OCR = normalize(import.meta.env.VITE_API_URL_OCR);

const CHATBOT_API = axios.create({ baseURL: BASE_URL_CHATBOT, timeout: 60000 });
const OCR_API = axios.create({ baseURL: BASE_URL_OCR, timeout: 60000 });

export const warmUp = async () => {
  try {
    await Promise.allSettled([CHATBOT_API.get("/"), OCR_API.get("/")]);
  } catch {}
};

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

export const chatWithBot = async (text) => {
  const res = await CHATBOT_API.post("/chat", {
    text,
    lang: i18n.language || "hi",
  });
  return res.data;
};

export const chatWithBotAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "voice.webm");
  formData.append("lang", i18n.language || "hi");

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
    lang: i18n.language || "hi",
  });
  return res.data;
};

export const getPIBNews = async (count = 10) => {
  const res = await CHATBOT_API.get("/pib-news", { params: { count } });
  return res.data;
};

export const getTopCommodities = async (state = "Punjab") => {
  const res = await CHATBOT_API.get("/top-commodities", { params: { state } });
  return res.data;
};