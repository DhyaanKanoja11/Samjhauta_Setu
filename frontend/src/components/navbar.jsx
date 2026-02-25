import { Sun, Moon, Home, Wheat, FileText, Scale, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import GoogleTranslate from "./GoogleTranslate";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 z-50">
      <div className="h-[72px] flex items-center justify-between max-w-6xl mx-auto px-4 md:px-6">

        {/* Logo */}
        <div className="text-xl font-bold text-green-700 dark:text-green-400">
          🌾 Samjhauta Setu
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-[15px] font-medium">

          <Link to="/" className="flex items-center gap-1">
            <Home size={16} /> Dashboard
          </Link>

          <Link to="/mandi" className="flex items-center gap-1">
            <Wheat size={16} /> Mandi
          </Link>

          <Link to="/documents" className="flex items-center gap-1">
            <FileText size={16} /> Documents
          </Link>

          <Link to="/cases" className="flex items-center gap-1">
            <Scale size={16} /> Disputes
          </Link>

          <Link to="/profile" className="flex items-center gap-1">
            <User size={16} /> Profile
          </Link>

          {/* Google Translate */}
          <GoogleTranslate />

          {/* Dark Mode */}
          <button onClick={toggleDark}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile — Only Translate + Dark */}
        <div className="md:hidden flex items-center gap-3">
          <GoogleTranslate />
          <button onClick={toggleDark}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

      </div>
    </nav>
  );
}