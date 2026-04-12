import { Home, Wheat, FileText, Scale, User, Sun, Moon, Landmark, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || localStorage.getItem("selectedLanguage") || "en"
  );
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("language", language);
    localStorage.setItem("selectedLanguage", language);
    const tryApply = () => {
      const select = document.querySelector(".goog-te-combo");
      if (!select) return false;
      select.value = language;
      select.dispatchEvent(new Event("change"));
      return true;
    };
    if (tryApply()) return;
    let tries = 0;
    const interval = setInterval(() => {
      tries += 1;
      if (tryApply() || tries > 40) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [language]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    window.dispatchEvent(new Event("auth-update"));
    navigate("/login");
  };

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/mandi", icon: Wheat, label: "Mandi" },
    { path: "/documents", icon: FileText, label: "Scanner" },
    { path: "/cases", icon: Scale, label: "Disputes" },
    { path: "/krishi-setu", icon: Landmark, label: "Krishi Setu" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 dark:bg-[#0F110C]/80 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50 shadow-sm"
          : "bg-white dark:bg-[#0F110C] border-b border-neutral-100 dark:border-neutral-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-green/30 group-hover:scale-105 transition-transform">
              <Wheat size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Samjhauta<span className="text-brand-green">Setu</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    active 
                      ? "text-brand-green bg-brand-green/10" 
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <item.icon size={16} strokeWidth={active ? 2.5 : 2} />
                  {item.label}
                  {active && (
                    <motion.div layoutId="nav-indicator" className="absolute inset-0 border border-brand-green/20 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Tools */}
          <div className="hidden md:flex items-center gap-4 border-l border-neutral-200 dark:border-neutral-800 pl-6 ml-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-neutral-100 dark:bg-neutral-800 border-none rounded-full px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200 cursor-pointer outline-none hover:ring-2 hover:ring-brand-green/50 transition-all focus:ring-2 focus:ring-brand-green"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="gu">ગુજરાતી</option>
            </select>

            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="p-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-brand-green/10 hover:text-brand-green transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
            </button>

            <button 
              onClick={handleLogout} 
              className="p-2.5 rounded-full bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Mobile Theme Toggle (Visible only on small screens) */}
          <div className="md:hidden flex items-center gap-4">
             <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

        </div>
      </div>
    </motion.nav>
  );
}