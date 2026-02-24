import { useState, useEffect } from 'react';
import { TrendingUp, FileText, Scale, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import MandiPrices from '../components/dashboard/MandiPrices';
import VoiceAssistant from '../components/dashboard/VoiceAssistant';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { getPIBNews, warmUp } from '../services/api';

export default function Dashboard() {
  const { t } = useTranslation();
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || 'किसान भाई');
  const [news, setNews] = useState([]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // ✅ Wake servers first

        // ✅ Then fetch news
        const data = await getPIBNews(10);
        if (mounted) setNews(data.news || []);
      } catch (err) {
        console.error("News Fetch Error:", err);
        if (mounted) setNews([]);
      }
    };

    init();

    const handleStorage = () => setUserName(localStorage.getItem('userName') || 'किसान भाई');
    window.addEventListener('storage', handleStorage);

    return () => {
      mounted = false;
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const recentCases = [
    {
      id: 1,
      title: t('landDispute'),
      status: t('ongoing'),
      date: t('2daysAgo'),
      priority: t('high'),
    },
    {
      id: 2,
      title: t('cropInsurance'),
      status: t('review'),
      date: t('5daysAgo'),
      priority: t('medium'),
    },
  ];

  return (
    <div className="min-h-screen bg-brand-cream/10 dark:bg-[#0F110C] pb-24 md:pb-8 transition-colors duration-300">
      <div className="container-custom py-8 md:py-12 space-y-10">

        {/* Hero */}
        <div className="relative overflow-hidden bg-brand-green rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-black">
                {t('hello')}, {userName} 🙏
              </h1>
              <p className="text-lg">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div>
              <Link to="/documents">
                <Button size="lg" className="bg-white text-brand-green">
                  <ShieldCheck className="w-5 h-5" />
                  {t('legalPaperChecker')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* News + Mandi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-3xl font-black text-brand-green">
              {t('newsFeed')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.length > 0 ? news.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block glass p-6 rounded-[2rem] hover:scale-[1.03] transition-all"
                >
                  <h3 className="font-bold text-lg mb-3 line-clamp-2">
                    {item.title}
                  </h3>
                  <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    READ MORE <ArrowUpRight className="w-3 h-3" />
                  </span>
                </a>
              )) : (
                <div className="text-neutral-400">
                  No news available.
                </div>
              )}
            </div>

            <MandiPrices compact />
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-4 space-y-10">
            <Card>
              <h2 className="text-2xl font-black text-brand-green mb-6">
                {t('activeCases')}
              </h2>

              <div className="space-y-4">
                {recentCases.map((caseItem) => (
                  <div key={caseItem.id} className="p-5 rounded-3xl bg-neutral-100">
                    <h3 className="font-bold mb-2">{caseItem.title}</h3>
                    <div className="text-xs text-neutral-500">
                      {caseItem.status} • {caseItem.date}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <VoiceAssistant />
    </div>
  );
}


