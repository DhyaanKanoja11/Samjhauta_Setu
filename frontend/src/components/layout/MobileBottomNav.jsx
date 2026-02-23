import { Home, Wheat, FileText, Scale } from "lucide-react";

export default function MobileBottomNav() {
  return (
    <div className="mobile-bottom-nav">

      <a href="/" className="flex flex-col items-center text-xs tap-large">
        <Home size={20} />
        Home
      </a>

      <a href="/mandi" className="flex flex-col items-center text-xs tap-large">
        <Wheat size={20} />
        Mandi
      </a>

      <a href="/documents" className="flex flex-col items-center text-xs tap-large">
        <FileText size={20} />
        Scan
      </a>

      <a href="/cases" className="flex flex-col items-center text-xs tap-large">
        <Scale size={20} />
        Disputes
      </a>

    </div>
  );
}