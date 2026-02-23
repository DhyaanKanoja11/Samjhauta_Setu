import { Home, CloudSun, Newspaper, Wheat } from "lucide-react";

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

      <a href="/weather" className="flex flex-col items-center text-xs tap-large">
        <CloudSun size={20} />
        Weather
      </a>

      <a href="/news" className="flex flex-col items-center text-xs tap-large">
        <Newspaper size={20} />
        News
      </a>

    </div>
  );
}