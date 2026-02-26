import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PriceCard from '../common/PriceCard';
import Button from '../common/Button';
import { getTopCommodities } from '../../services/api';

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
      const response = await getTopCommodities(state);

      const formatted = (response.data || []).map((item, index) => ({
        id: index,
        crop: item.crop,
        price: Number(item.price),
        unit: item.unit || '₹/quintal',
        change: 0,
        changePercent: 0,
      }));

      setPrices(formatted);
    } catch (err) {
      console.error('Mandi fetch error:', err);
      setError("Unable to fetch mandi prices. Please try again later.");
      setPrices([]);
    }

    setLoading(false);
  };

  const filteredPrices = prices.filter(item =>
    item.crop?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayPrices = compact
    ? filteredPrices.slice(0, 4)
    : filteredPrices;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="animate-pulse bg-neutral-200 dark:bg-neutral-800 h-40 rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <h2 className="text-3xl font-bold text-brand-green">
          {t('mandiUpdate') || "Live Mandi Prices"}
        </h2>

        {!compact && (
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search crop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-xl border dark:bg-neutral-900"
            />

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 rounded-xl border dark:bg-neutral-900"
            >
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Gujarat">Gujarat</option>
            </select>
          </div>
        )}
      </div>

      {error && (
        <div className="text-center text-red-500">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayPrices.length > 0 ? (
          displayPrices.map(item => (
            <PriceCard
              key={item.id}
              crop={item.crop}
              price={item.price}
              unit={item.unit}
              change={item.change}
              changePercent={item.changePercent}
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-10 text-neutral-500">
            No mandi prices available for selected state.
          </div>
        )}
      </div>

      {compact && filteredPrices.length > 4 && (
        <Link to="/mandi">
          <Button className="w-full">
            View All
          </Button>
        </Link>
      )}

    </div>
  );
}

MandiPrices.propTypes = {
  compact: PropTypes.bool,
};