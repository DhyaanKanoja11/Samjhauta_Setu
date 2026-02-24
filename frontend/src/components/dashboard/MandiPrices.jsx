import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PriceCard from '../common/PriceCard';
import Button from '../common/Button';
import { getTopCommodities, warmUp } from '../../services/api';

export default function MandiPrices({ compact = false }) {
  const { t } = useTranslation();

  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Punjab');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(selectedLocation);
  }, [selectedLocation]);

  const fetchData = async (state) => {
    setLoading(true);
    setError(null);

    try {
      // 🔥 Wake backend first (important for Render free tier)
      await warmUp();

      const response = await getTopCommodities(state);

      if (!response || !response.data) {
        setPrices([]);
        setLoading(false);
        return;
      }

      const formatted = response.data.map((item, index) => ({
        id: index + 1,
        crop: item.crop,
        price: item.price,
        change: 0,
        changePercent: 0,
        unit: item.unit,
      }));

      setPrices(formatted);
    } catch (err) {
      console.error('Mandi fetch error:', err);
      setError('Unable to fetch mandi prices.');
      setPrices([]);
    }

    setLoading(false);
  };

  const filteredPrices = prices.filter(item =>
    item.crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayPrices = compact
    ? filteredPrices.slice(0, 4)
    : filteredPrices;

  // ----------------------------
  // Loading Skeleton
  // ----------------------------
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="animate-pulse bg-neutral-200/30 h-48 rounded-3xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-brand-green tracking-tight">
            {t('mandiUpdate') || "Live Mandi Prices"}
          </h2>
        </div>

        {!compact && (
          <div className="flex flex-col sm:flex-row gap-4">

            <input
              type="text"
              placeholder={t('searchCrop') || "Search crop..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-green"
            />

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-green"
            >
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
            </select>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="text-center py-6 text-red-500">
          {error}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayPrices.length > 0 ? (
          displayPrices.map(item => (
            <PriceCard
              key={item.id}
              crop={item.crop}
              price={item.price}
              change={item.change}
              changePercent={item.changePercent}
              unit={item.unit}
              variant="premium"
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-12 text-neutral-500">
            {t('noPricesFound') || "No prices found for selected location"}
          </div>
        )}
      </div>

      {/* Compact Mode Button */}
      {compact && filteredPrices.length > 4 && (
        <Link to="/mandi" className="block">
          <Button variant="outline" className="w-full py-4 rounded-3xl">
            {t('viewAll') || "View All"} ({filteredPrices.length})
          </Button>
        </Link>
      )}

    </div>
  );
}

MandiPrices.propTypes = {
  compact: PropTypes.bool,
};