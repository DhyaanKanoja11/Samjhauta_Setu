import { Link, useLocation } from "react-router-dom";
import { Home, Wheat, FileText, Scale, User, AArrowUp, AArrowDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const [fontScale, setFontScale] = useState(1);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const increaseFont = () => {
    const newScale = fontScale + 0.1;
    document.documentElement.style.fontSize = `${newScale}rem`;
    setFontScale(newScale);
  };

  const decreaseFont = () => {
    const newScale = fontScale - 0.1;
    document.documentElement.style.fontSize = `${newScale}rem`;
    setFontScale(newScale);
  };

  const navItem = (to, label, icon) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
        location.pathname === to
          ? "bg-brand-green text-white"
          : "hover:bg-neutral-200 dark:hover:bg-neutral-800"
      }`}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-neutral-900 border-b shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-[68px] flex items-center justify-between">

        {/* Logo */}
        <div className="font-bold text-lg text-brand-green">
          🌾 Samjhauta Setu
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          {navItem("/", "Dashboard", <Home size={16} />)}
          {navItem("/mandi", "Mandi", <Wheat size={16} />)}
          {navItem("/documents", "Scanner", <FileText size={16} />)}
          {navItem("/cases", "Disputes", <Scale size={16} />)}
          {navItem("/profile", "Profile", <User size={16} />)}
        </div>

        {/* Accessibility + Language */}
        <div className="flex items-center gap-3 text-xs">

          {/* Font Controls */}
          <button onClick={decreaseFont} className="hover:text-brand-green">
            <AArrowDown size={16} />
          </button>
          <button onClick={increaseFont} className="hover:text-brand-green">
            <AArrowUp size={16} />
          </button>

          {/* Language */}
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            className="border rounded px-2 py-1 text-xs"
          >
            <option value="en">EN</option>
            <option value="hi">हिन्दी</option>
            <option value="gu">ગુજરાતી</option>
          </select>
        </div>

      </div>
    </nav>
  );
}