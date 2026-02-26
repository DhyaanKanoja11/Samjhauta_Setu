import { Home, Wheat, FileText, Scale, User, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  const [fontSize, setFontSize] = useState(
    localStorage.getItem("fontSize") || "base"
  );

  // Dark Mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Font Size
  useEffect(() => {
    document.documentElement.classList.remove("text-sm", "text-base", "text-lg");

    if (fontSize === "sm") document.documentElement.classList.add("text-sm");
    else if (fontSize === "lg") document.documentElement.classList.add("text-lg");
    else document.documentElement.classList.add("text-base");

    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  // Google Translate Fix
  useEffect(() => {
    localStorage.setItem("language", language);

    const applyTranslate = () => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = language;
        select.dispatchEvent(new Event("change"));
      }
    };

    setTimeout(applyTranslate, 500);
  }, [language]);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 z-50">

      <div className="h-[72px] flex items-center justify-between max-w-6xl mx-auto px-4">

        <div className="text-xl font-bold text-green-700 dark:text-green-400">
          🌾 Samjhauta Setu
        </div>

        <div className="hidden md:flex items-center gap-6 text-[15px] font-medium">

          <Link to="/" className="flex items-center gap-1">
            <Home size={16} /> Dashboard
          </Link>

          <Link to="/mandi" className="flex items-center gap-1">
            <Wheat size={16} /> Mandi
          </Link>

          <Link to="/documents" className="flex items-center gap-1">
            <FileText size={16} /> Scanner
          </Link>

          <Link to="/cases" className="flex items-center gap-1">
            <Scale size={16} /> Disputes
          </Link>

          <Link to="/profile" className="flex items-center gap-1">
            <User size={16} /> Profile
          </Link>

          {/* Font Controls */}
          <div className="flex gap-2 text-sm">
            <button onClick={() => setFontSize("sm")}>A-</button>
            <button onClick={() => setFontSize("base")}>A</button>
            <button onClick={() => setFontSize("lg")}>A+</button>
          </div>

          {/* Language */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded px-2 py-1 text-sm 
             bg-white text-black 
             dark:bg-neutral-800 dark:text-white 
             dark:border-neutral-600"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="gu">ગુજરાતી</option>
          </select>

          {/* Dark Mode */}
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-3">

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded px-2 py-1 text-xs 
             bg-white text-black 
             dark:bg-neutral-800 dark:text-white 
             dark:border-neutral-600"
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="gu">GU</option>
          </select>

          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

        </div>

      </div>
    </nav>
  );
}