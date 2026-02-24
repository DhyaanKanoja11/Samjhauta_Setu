import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import PriceCard from "../common/PriceCard";
import Button from "../common/Button";

export default function MandiPrices({ compact = false }) {
  const { t } = useTranslation();

  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Punjab");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(selectedLocation);
  }, [selectedLocation]);

  const fetchData = async (state) => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL_CHATBOT}/top-commodities?state=${state}`;

      const res = await fetch(apiUrl);

      if (!res.ok) {
        throw new Error(`API Error ${res.status}`);
      }

      const data = await res.json();

      if (!data.data || data.data.length === 0) {
        setPrices([]);
        setLoading(false);
        return;
      }

      const formatted = data.data.map((item, index) => ({
        id: index + 1,
        crop: item.crop,
        price: item.price,
        change: 0,
        changePercent: 0,
        unit: item.unit,
      }));

      setPrices(formatted);
    } catch (err) {
      console.error("Mandi fetch error:", err);
      setError("Unable to fetch mandi prices.");
      setPrices([]);
    }

    setLoading(false);
  };

  const filteredPrices = prices.filter((item) =>
    item.crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayPrices = compact
    ? filteredPrices.slice(0, 4)
    : filteredPrices;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-green">
            {t("mandiUpdate") || "Live Mandi Prices"}
          </h2>
        </div>

        {!compact && (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search crop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            {/* State Selector */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-green"
            >
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Gujarat">Gujarat</option>
            </select>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-neutral-200 dark:bg-neutral-800 h-40 rounded-2xl"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="text-center py-10 text-red-500">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && displayPrices.length === 0 && (
        <div className="text-center py-10 text-neutral-500">
          No mandi prices available for this state.
        </div>
      )}

      {/* Grid */}
      {!loading && !error && displayPrices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayPrices.map((item) => (
            <PriceCard
              key={item.id}
              crop={item.crop}
              price={item.price}
              change={item.change}
              changePercent={item.changePercent}
              unit={item.unit}
              variant="premium"
            />
          ))}
        </div>
      )}

      {/* View All (Dashboard Mode) */}
      {compact && filteredPrices.length > 4 && (
        <Link to="/mandi" className="block">
          <Button variant="outline" className="w-full py-4 rounded-2xl">
            View All ({filteredPrices.length})
          </Button>
        </Link>
      )}
    </div>
  );
}

MandiPrices.propTypes = {
  compact: PropTypes.bool,
};