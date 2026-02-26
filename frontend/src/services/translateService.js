// src/services/translateService.js

const translationCache = {};

export async function translateText(text, targetLang) {
  if (!text || targetLang === "en") return text;

  const cacheKey = text + "_" + targetLang;

  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: targetLang,
        format: "text"
      })
    });

    const data = await response.json();

    translationCache[cacheKey] = data.translatedText;
    return data.translatedText;

  } catch (error) {
    console.error("Translation Error:", error);
    return text;
  }
}