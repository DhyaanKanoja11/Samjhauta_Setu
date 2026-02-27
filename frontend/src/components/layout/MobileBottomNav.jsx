import { Home, Wheat, FileText, Scale, Landmark } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function MobileBottomNav() {
  const location = useLocation();

  const itemClass = (path) =>
    `flex flex-col items-center text-xs transition ${
      location.pathname === path
        ? "text-green-700 dark:text-green-400 font-semibold"
        : "text-neutral-700 dark:text-neutral-200"
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 md:hidden flex justify-around py-2 z-40">
      <Link to="/" className={itemClass("/")}>
        <Home size={20} />
        Home
      </Link>

      <Link to="/mandi" className={itemClass("/mandi")}>
        <Wheat size={20} />
        Mandi
      </Link>

      <Link to="/documents" className={itemClass("/documents")}>
        <FileText size={20} />
        Scan
      </Link>

      <Link to="/cases" className={itemClass("/cases")}>
        <Scale size={20} />
        Disputes
      </Link>

      <Link to="/krishi-setu" className={itemClass("/krishi-setu")}>
        <Landmark size={20} />
        Setu
      </Link>
    </div>
  );
}