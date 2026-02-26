import { useState, useEffect } from 'react';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import MandiPrices from '../components/dashboard/MandiPrices';
import Button from '../components/common/Button';
import { getPIBNews } from '../services/api';

export default function Dashboard() {
  const { t } = useTranslation();
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || 'किसान भाई');
  const [news, setNews] = useState([]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const data = await getPIBNews(10);
        if (mounted) setNews(data.news || []);
      } catch (err) {
        console.error("News Fetch Error:", err);
        if (mounted) setNews([]);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F110C] pb-24 md:pb-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto py-8 md:py-12 space-y-12 px-4">

        {/* Clean Hero */}
        <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-900 p-10 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold">
                {t('hello')}, {userName} 🙏
              </h1>
              <p className="text-sm text-neutral-500">
                {new Date().toLocaleDateString()}
              </p>
            </div>

            <Link to="/documents">
              <Button className="bg-green-700 text-white">
                <ShieldCheck className="w-5 h-5" />
                {t('legalPaperChecker')}
              </Button>
            </Link>
          </div>
        </div>

        {/* News */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-green-700">
            {t('newsFeed')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.length > 0 ? news.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-900 hover:scale-[1.02] transition"
              >
                <h3 className="font-semibold mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <span className="text-xs font-bold flex items-center gap-2 text-green-700">
                  READ MORE <ArrowUpRight className="w-3 h-3" />
                </span>
              </a>
            )) : (
              <div className="text-neutral-400">
                No news available.
              </div>
            )}
          </div>
        </div>

        <MandiPrices compact />

      </div>
    </div>
  );
}