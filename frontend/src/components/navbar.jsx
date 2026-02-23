import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 z-50">
        <div className="h-[68px] px-12 flex items-center justify-between max-w-7xl mx-auto">

          <div className="text-xl font-bold text-green-700 dark:text-green-400">
            🌾 Samjhauta Setu
          </div>

          <div className="hidden md:flex items-center gap-8 text-[15px] font-medium">

            <Link to="/">Dashboard</Link>
            <Link to="/mandi">Mandi Prices</Link>
            <Link to="/documents">Document Scanner</Link>
            <Link to="/cases">Manage Disputes</Link>
            <Link to="/profile">Profile</Link>

            <button onClick={toggleDark}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed top-[68px] left-0 right-0 bg-white dark:bg-neutral-900 shadow-md md:hidden z-40 p-6 space-y-4">
          <Link to="/">Dashboard</Link>
          <Link to="/mandi">Mandi Prices</Link>
          <Link to="/documents">Document Scanner</Link>
          <Link to="/cases">Manage Disputes</Link>
          <Link to="/profile">Profile</Link>
        </div>
      )}
    </>
  );
}