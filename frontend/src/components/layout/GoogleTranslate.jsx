import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    // Prevent duplicate script injection
    if (document.getElementById("google-translate-script")) return;

    // Ensure container exists (hidden)
    let el = document.getElementById("google_translate_element");
    if (!el) {
      el = document.createElement("div");
      el.id = "google_translate_element";
      el.style.display = "none";
      document.body.appendChild(el);
    }

    // ✅ Define callback FIRST (important)
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate) return;

      // eslint-disable-next-line no-new
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,gu",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    // Inject script AFTER callback exists
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    document.body.appendChild(script);
  }, []);

  return null;
}