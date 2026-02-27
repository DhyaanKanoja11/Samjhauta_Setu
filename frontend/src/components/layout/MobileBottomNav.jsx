import {
  Home,
  Wheat,
  FileText,
  Scale,
  Landmark,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function MobileBottomNav() {
  const location = useLocation();

  const itemClass = (path) =>
    `flex flex-col items-center justify-center flex-1 text-[10px] transition ${
      location.pathname === path
        ? "text-green-700 dark:text-green-400 font-semibold"
        : "text-neutral-700 dark:text-neutral-200"
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 
      bg-white dark:bg-neutral-900 
      border-t border-neutral-200 dark:border-neutral-800 
      md:hidden flex items-center justify-between 
      px-1 py-2 z-40">

      <Link to="/" className={itemClass("/")}>
        <Home size={18} />
        Home
      </Link>

      <Link to="/mandi" className={itemClass("/mandi")}>
        <Wheat size={18} />
        Mandi
      </Link>

      <Link to="/documents" className={itemClass("/documents")}>
        <FileText size={18} />
        Scan
      </Link>

      <Link to="/cases" className={itemClass("/cases")}>
        <Scale size={18} />
        Cases
      </Link>

      <Link to="/krishi-setu" className={itemClass("/krishi-setu")}>
        <Landmark size={18} />
        Setu
      </Link>

      <Link to="/profile" className={itemClass("/profile")}>
        <User size={18} />
        Profile
      </Link>
    </div>
  );
}