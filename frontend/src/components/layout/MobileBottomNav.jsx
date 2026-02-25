import { Link, useLocation } from "react-router-dom";
import { Home, Wheat, FileText, Scale } from "lucide-react";

export default function MobileBottomNav() {
  const location = useLocation();

  const itemStyle = (path) =>
    location.pathname === path
      ? "text-green-600"
      : "text-neutral-500";

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 z-50">
      <div className="flex justify-around items-center h-[70px]">

        <Link to="/" className={`flex flex-col items-center text-xs ${itemStyle("/")}`}>
          <Home size={20} />
          Home
        </Link>

        <Link to="/mandi" className={`flex flex-col items-center text-xs ${itemStyle("/mandi")}`}>
          <Wheat size={20} />
          Mandi
        </Link>

        <Link to="/documents" className={`flex flex-col items-center text-xs ${itemStyle("/documents")}`}>
          <FileText size={20} />
          Scan
        </Link>

        <Link to="/cases" className={`flex flex-col items-center text-xs ${itemStyle("/cases")}`}>
          <Scale size={20} />
          Disputes
        </Link>

      </div>
    </div>
  );
}