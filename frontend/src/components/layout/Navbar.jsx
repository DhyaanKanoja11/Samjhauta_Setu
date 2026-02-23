import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="navbar fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">

          {/* LOGO */}
          <div className="text-lg font-semibold text-green-700 dark:text-green-400">
            🌾 Samjhauta Setu
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="/" className="hover:text-green-600">Home</a>
            <a href="/mandi" className="hover:text-green-600">Mandi</a>
            <a href="/weather" className="hover:text-green-600">Weather</a>
            <a href="/news" className="hover:text-green-600">News</a>

            <button
              onClick={toggleDark}
              className="tap-large flex items-center justify-center"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden tap-large"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div className="fixed top-16 left-0 right-0 bg-white dark:bg-neutral-900 shadow-md md:hidden z-40">
          <div className="flex flex-col p-4 gap-4 text-base font-medium">
            <a href="/" onClick={() => setIsOpen(false)}>Home</a>
            <a href="/mandi" onClick={() => setIsOpen(false)}>Mandi</a>
            <a href="/weather" onClick={() => setIsOpen(false)}>Weather</a>
            <a href="/news" onClick={() => setIsOpen(false)}>News</a>

            <button
              onClick={toggleDark}
              className="flex items-center gap-2"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}