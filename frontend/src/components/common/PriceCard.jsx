import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import Card from './Card';

export default function PriceCard({
    crop,
    price,
    unit = '₹/quintal',
    change,
    changePercent,
    variant = 'default',
    onClick
}) {
    const isUp = change > 0;
    const isDown = change < 0;

    const getTrendColor = () => {
        if (isUp) return 'text-green-600 dark:text-green-400';
        if (isDown) return 'text-red-600 dark:text-red-400';
        return 'text-neutral-400';
    };

    const getBgColor = () => {
        if (isUp) return 'bg-green-50 dark:bg-green-900/10';
        if (isDown) return 'bg-red-50 dark:bg-red-900/10';
        return 'bg-neutral-50 dark:bg-neutral-800/10';
    };

    return (
        <Card
            variant="glass"
            className="group cursor-pointer hover:border-brand-green/30 hover:scale-[1.02] transition-all duration-500 overflow-hidden"
            onClick={onClick}
        >
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-tan animate-pulse" />
                            <h3 className="font-black text-xl text-brand-green dark:text-brand-tan leading-tight">
                                {crop}
                            </h3>
                        </div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{unit}</p>
                    </div>
                    <div className={`p-3 rounded-2xl ${getBgColor()} transition-colors`}>
                        {isUp ? <TrendingUp className={`w-6 h-6 ${getTrendColor()}`} /> :
                            isDown ? <TrendingDown className={`w-6 h-6 ${getTrendColor()}`} /> :
                                <Minus className={`w-6 h-6 ${getTrendColor()}`} />}
                    </div>
                </div>

                <div className="flex items-end justify-between">
                    <div className="space-y-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-brand-green dark:text-brand-tan">₹{price.toLocaleString('en-IN')}</span>
                            <span className="text-xs font-bold text-neutral-400">/{unit.split('/')[1] || 'क्विंटल'}</span>
                        </div>
                        {changePercent !== undefined && (
                            <div className={`flex items-center gap-1.5 text-xs font-black ${getTrendColor()}`}>
                                <span className={`px-1.5 py-0.5 rounded-md ${getBgColor()}`}>
                                    {isUp ? '+' : ''}{change}
                                </span>
                                <span>({isUp ? '+' : ''}{changePercent}%)</span>
                            </div>
                        )}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-300">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.03] dark:opacity-[0.05] rounded-full translate-x-1/2 -translate-y-1/2 transition-transform duration-700 group-hover:scale-150 ${isUp ? 'bg-green-600' : isDown ? 'bg-red-600' : 'bg-neutral-600'}`} />
        </Card>
    );
}

PriceCard.propTypes = {
    crop: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    unit: PropTypes.string,
    change: PropTypes.number,
    changePercent: PropTypes.number,
    variant: PropTypes.string,
    onClick: PropTypes.func,
};
