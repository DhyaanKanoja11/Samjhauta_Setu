import { Home, Wheat, FileText, Scale, Landmark, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/mandi", icon: Wheat, label: "Mandi" },
    { path: "/documents", icon: FileText, label: "Scan" },
    { path: "/cases", icon: Scale, label: "Cases" },
    { path: "/krishi-setu", icon: Landmark, label: "Setu" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 pb-4 pt-2 pointer-events-none">
      <div className="bg-white/80 dark:bg-[#0F110C]/90 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full flex items-center justify-around px-2 py-2 pointer-events-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className="relative flex flex-col items-center justify-center w-12 h-12"
            >
              {isActive && (
                <motion.div 
                  layoutId="mobile-nav-bubble" 
                  className="absolute inset-0 bg-brand-green/10 dark:bg-brand-green/20 rounded-full" 
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon 
                size={20} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={`relative z-10 transition-colors duration-300 ${
                  isActive ? "text-brand-green" : "text-neutral-500 dark:text-neutral-400"
                }`} 
              />
              <span 
                className={`text-[9px] font-semibold mt-1 relative z-10 transition-colors duration-300 ${
                  isActive ? "text-brand-green" : "text-neutral-500 dark:text-neutral-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
