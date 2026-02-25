import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const [fontSize, setFontSize] = useState(
    localStorage.getItem("fontSize") || "base"
  );

  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  // Dark Mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Font Size
  useEffect(() => {
    document.documentElement.classList.remove("text-sm", "text-base", "text-lg");

    if (fontSize === "sm") {
      document.documentElement.classList.add("text-sm");
    } else if (fontSize === "lg") {
      document.documentElement.classList.add("text-lg");
    } else {
      document.documentElement.classList.add("text-base");
    }

    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  // Google Translate trigger
  useEffect(() => {
    localStorage.setItem("language", language);
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = language;
      select.dispatchEvent(new Event("change"));
    }
  }, [language]);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
        fontSize,
        setFontSize,
        language,
        setLanguage,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);