import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import Card from './Card';

export default function PriceCard({
  crop,
  price,
  unit = '₹/quintal',
  change = null,
  changePercent = null,
  market = null,
  lastUpdated = null,
  onClick
}) {

  const numericPrice = Number(price) || 0;

  const hasTrend = change !== null && changePercent !== null;
  const isUp = hasTrend && change > 0;
  const isDown = hasTrend && change < 0;

  const getTrendColor = () => {
    if (isUp) return 'text-green-600 dark:text-green-400';
    if (isDown) return 'text-red-600 dark:text-red-400';
    return 'text-neutral-400';
  };

  const getBgColor = () => {
    if (isUp) return 'bg-green-50 dark:bg-green-900/10';
    if (isDown) return 'bg-red-50 dark:bg-red-900/10';
    return 'bg-neutral-100 dark:bg-neutral-800/40';
  };

  return (
    <Card
      variant="glass"
      className="group cursor-pointer hover:border-brand-green/30 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
      onClick={onClick}
    >
      <div className="relative z-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-bold text-xl text-brand-green dark:text-brand-tan">
              {crop}
            </h3>
            <p className="text-xs text-neutral-400 uppercase tracking-widest">
              {unit}
            </p>
          </div>

          {hasTrend && (
            <div className={`p-3 rounded-2xl ${getBgColor()}`}>
              {isUp ? (
                <TrendingUp className={`w-5 h-5 ${getTrendColor()}`} />
              ) : (
                <TrendingDown className={`w-5 h-5 ${getTrendColor()}`} />
              )}
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl font-bold text-brand-green dark:text-brand-tan">
              ₹{numericPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-neutral-500 ml-1">
              /quintal
            </span>

            {/* Trend Display (only if real data exists) */}
            {hasTrend && (
              <div className={`mt-2 text-xs font-semibold ${getTrendColor()}`}>
                {isUp ? '+' : ''}{change} ({isUp ? '+' : ''}{changePercent}%)
              </div>
            )}

            {/* Extra Details */}
            {(market || lastUpdated) && (
              <div className="mt-3 text-xs text-neutral-500 space-y-1">
                {market && <div>Market: {market}</div>}
                {lastUpdated && <div>Updated: {lastUpdated}</div>}
              </div>
            )}
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition">
            <ArrowRight className="w-5 h-5 text-brand-green" />
          </div>
        </div>

      </div>
    </Card>
  );
}

PriceCard.propTypes = {
  crop: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  unit: PropTypes.string,
  change: PropTypes.number,
  changePercent: PropTypes.number,
  market: PropTypes.string,
  lastUpdated: PropTypes.string,
  onClick: PropTypes.func,
};