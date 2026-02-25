import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const linkStyle = (path) =>
    location.pathname === path
      ? "text-green-600 dark:text-green-400 font-semibold"
      : "hover:text-green-600 dark:hover:text-green-400";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 z-50">
        <div className="h-[68px] mx-auto max-w-6xl px-4 md:px-8 flex items-center justify-between">

          <div className="text-xl font-bold text-green-700 dark:text-green-400">
            🌾 Samjhauta Setu
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-[15px] font-medium">

            <Link to="/" className={linkStyle("/")}>Dashboard</Link>
            <Link to="/mandi" className={linkStyle("/mandi")}>Mandi Prices</Link>
            <Link to="/documents" className={linkStyle("/documents")}>Scanner</Link>
            <Link to="/cases" className={linkStyle("/cases")}>Disputes</Link>
            <Link to="/profile" className={linkStyle("/profile")}>Profile</Link>

            <button onClick={toggleDark}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile Burger */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed top-[68px] left-0 right-0 bg-white dark:bg-neutral-900 shadow-md md:hidden z-40 p-6 space-y-4">
          <Link to="/" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link to="/mandi" onClick={() => setIsOpen(false)}>Mandi Prices</Link>
          <Link to="/documents" onClick={() => setIsOpen(false)}>Scanner</Link>
          <Link to="/cases" onClick={() => setIsOpen(false)}>Disputes</Link>
          <Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
        </div>
      )}
    </>
  );
}