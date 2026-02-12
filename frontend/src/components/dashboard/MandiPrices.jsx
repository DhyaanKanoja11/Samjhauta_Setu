import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Search, TrendingUp, MapPin, Calendar, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import PriceCard from '../common/PriceCard';
import Card from '../common/Card';
import Button from '../common/Button';

const mockMandiPrices = [
    { id: 1, crop: 'गेहूं (Wheat)', price: 2150, change: 50, changePercent: 2.4, unit: '₹/quintal', image: null },
    { id: 2, crop: 'धान (Rice)', price: 1950, change: -30, changePercent: -1.5, unit: '₹/quintal', image: null },
    { id: 3, crop: 'मक्का (Maize)', price: 1800, change: 75, changePercent: 4.3, unit: '₹/quintal', image: null },
    { id: 4, crop: 'सोयाबीन (Soybean)', price: 4200, change: 100, changePercent: 2.4, unit: '₹/quintal', image: null },
    { id: 5, crop: 'चना (Chickpea)', price: 5100, change: 0, changePercent: 0, unit: '₹/quintal', image: null },
    { id: 6, crop: 'सरसों (Mustard)', price: 5500, change: 150, changePercent: 2.8, unit: '₹/quintal', image: null },
];

export default function MandiPrices({ compact = false }) {
    const { t } = useTranslation();
    const [prices, setPrices] = useState(mockMandiPrices);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('all');

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setPrices(mockMandiPrices);
            setLoading(false);
        }, 500);
    }, []);

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
        <div className="space-y-8 animate-fade-in transition-all">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-brown/5 text-brand-brown rounded-full text-[10px] font-black uppercase tracking-widest">
                        <TrendingUp className="w-3 h-3" />
                        {t('liveUpdates') || 'Live Updates'}
                    </div>
                    <h2 className="text-4xl font-black text-brand-green dark:text-brand-tan tracking-tight">
                        {t('mandiUpdate')}
                    </h2>
                    <p className="text-neutral-500 font-medium">{t('todayMarketRates') || 'आज के ताज़ा बाज़ार दर और मंडी अपडेट'}</p>
                </div>
                {!compact && (
                    <div className="flex items-center gap-3 bg-white dark:bg-neutral-800 p-2 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700">
                        <button className="p-2 bg-brand-green/10 text-brand-green rounded-xl"><LayoutGrid className="w-5 h-5" /></button>
                        <button className="p-2 text-neutral-400 hover:bg-neutral-50 rounded-xl"><List className="w-5 h-5" /></button>
                    </div>
                )}
            </div>

            {/* Filters */}
            {!compact && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-8 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-brand-green transition-colors" />
                        <input
                            type="text"
                            placeholder={t('searchCropPlaceholder') || "फसल खोजें (जैसे: गेहूं, धान...)"}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-3xl focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 transition-all text-sm font-bold shadow-sm"
                        />
                    </div>
                    <div className="md:col-span-4 relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-brand-green transition-colors" />
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full pl-14 pr-12 py-4 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-3xl focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 transition-all text-sm font-bold shadow-sm appearance-none cursor-pointer"
                        >
                            <option value="all">{t('allMandis') || 'सभी मंडियां'}</option>
                            <option value="del">दिल्ली</option>
                            <option value="pun">पंजाब</option>
                            <option value="har">हरियाणा</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Price Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {displayPrices.map(item => (
                    <PriceCard
                        key={item.id}
                        crop={item.crop}
                        price={item.price}
                        change={item.change}
                        changePercent={item.changePercent}
                        unit={item.unit}
                        variant="premium"
                        onClick={() => console.log('Details:', item.crop)}
                    />
                ))}
            </div>

            {compact && filteredPrices.length > 4 && (
                <Link to="/mandi" className="block">
                    <Button variant="outline" className="w-full border-2 border-brand-green/20 hover:border-brand-green text-brand-green font-black py-4 rounded-3xl">
                        {t('viewAllMandiPrices') || 'सभी मंडी भाव देखें'} ({filteredPrices.length})
                        <TrendingUp className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            )}
        </div>
    );
}

MandiPrices.propTypes = {
    compact: PropTypes.bool,
};
