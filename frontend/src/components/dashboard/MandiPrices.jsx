import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Search, TrendingUp, MapPin, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import PriceCard from '../common/PriceCard';
import Button from '../common/Button';

export default function MandiPrices({ compact = false }) {
    const { t } = useTranslation();
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('Punjab');

    useEffect(() => {
        fetchData(selectedLocation);
    }, [selectedLocation]);

    const fetchData = async (state) => {
        setLoading(true);

        try {
            const res = await fetch(`http://localhost:5001/top-commodities?state=${state}`);
            const data = await res.json();

            const formatted = (data.data || []).map((item, index) => ({
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
        }

        setLoading(false);
    };

    const filteredPrices = prices.filter(item =>
        item.crop.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayPrices = compact ? filteredPrices.slice(0, 4) : filteredPrices;

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse bg-brand-cream/20 h-48 rounded-[2rem]" />
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
                    <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="px-4 py-2 rounded-2xl border"
                    >
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Gujarat">Gujarat</option>
                    </select>
                )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayPrices.map(item => (
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

            {compact && filteredPrices.length > 4 && (
                <Link to="/mandi" className="block">
                    <Button variant="outline" className="w-full py-4 rounded-3xl">
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