import { Home, Wheat, FileText, Scale } from "lucide-react";
import { Link } from "react-router-dom";

export default function MobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 md:hidden flex justify-around py-2 z-40">

      <Link to="/" className="flex flex-col items-center text-xs">
        <Home size={20} />
        Home
      </Link>

      <Link to="/mandi" className="flex flex-col items-center text-xs">
        <Wheat size={20} />
        Mandi
      </Link>

      <Link to="/documents" className="flex flex-col items-center text-xs">
        <FileText size={20} />
        Scan
      </Link>

      <Link to="/cases" className="flex flex-col items-center text-xs">
        <Scale size={20} />
        Disputes
      </Link>

    </div>
  );
}