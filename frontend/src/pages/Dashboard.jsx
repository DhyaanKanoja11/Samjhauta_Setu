import { useState, useEffect } from 'react';
import { TrendingUp, FileText, Scale, AlertCircle, Calendar, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MandiPrices from '../components/dashboard/MandiPrices';
import VoiceAssistant from '../components/dashboard/VoiceAssistant';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { t } = useTranslation();
    const [userName, setUserName] = useState(() => localStorage.getItem('userName') || 'किसान भाई');
    const [news, setNews] = useState([]);

    useEffect(() => {
        // Fetch real-time news from backend
        fetch('http://localhost:5001/news')
            .then(res => res.json())
            .then(data => setNews(data))
            .catch(err => console.error("News Fetch Error:", err));

        // Update name if changed in local storage
        const handleStorage = () => setUserName(localStorage.getItem('userName') || 'किसान भाई');
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const stats = [
        {
            label: t('activeCases'),
            value: '3',
            change: '+1',
            icon: Scale,
            color: 'text-brand-blue',
            bgColor: 'bg-brand-blue/10',
            trend: 'up'
        },
        {
            label: t('resolved'),
            value: '12',
            change: '+3',
            icon: FileText,
            color: 'text-brand-green',
            bgColor: 'bg-brand-green/10',
            trend: 'up'
        },
        {
            label: t('mandiPrices'),
            value: '₹2,850',
            change: '+2.5%',
            icon: TrendingUp,
            color: 'text-brand-brown',
            bgColor: 'bg-brand-brown/10',
            trend: 'up'
        },
    ];

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
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-brand-green dark:bg-neutral-800/50 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl border border-white/10">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black tracking-widest uppercase">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                {t('welcome')}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black font-display leading-[1.1]">
                                {t('hello')}, {userName} 🙏
                            </h1>
                            <p className="text-brand-cream/80 text-lg font-medium">
                                {(() => {
                                    try {
                                        return new Date().toLocaleDateString(t('locale') || 'hi-IN', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        });
                                    } catch (e) {
                                        return new Date().toDateString();
                                    }
                                })()}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Link to="/documents">
                                <Button size="lg" className="bg-white text-brand-green hover:bg-brand-tan hover:text-white border-none shadow-xl transform hover:-translate-y-1 transition-all">
                                    <ShieldCheck className="w-5 h-5 text-brand-green" />
                                    {t('legalPaperChecker')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                </div>

                {/* News & Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-8 animate-slide-up">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-black text-brand-green dark:text-brand-tan">{t('newsFeed')}</h2>
                            <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">{t('livePIB')}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {news.length > 0 ? news.map((item, i) => (
                                <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="block glass p-6 rounded-[2rem] hover:scale-[1.03] transition-all group">
                                    <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-brand-green dark:group-hover:text-brand-tan">{item.title}</h3>
                                    <span className="text-xs font-black text-brand-brown uppercase tracking-widest flex items-center gap-2">
                                        READ MORE <ArrowUpRight className="w-3 h-3" />
                                    </span>
                                </a>
                            )) : [1, 2].map(i => (
                                <div key={i} className="glass p-6 rounded-[2rem] animate-pulse h-32 bg-neutral-200/20" />
                            ))}
                        </div>
                        <MandiPrices compact />
                    </div>

                    <div className="lg:col-span-4 space-y-10 animate-slide-up delay-200">
                        {/* Right Column - Recent Activity */}
                        <Card variant="glass" className="h-full border-t-4 border-t-brand-green">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black text-brand-green dark:text-brand-tan">{t('activeCases')}</h2>
                                <Link to="/cases" className="text-[10px] font-black text-brand-brown uppercase tracking-widest hover:underline">
                                    {t('viewAll')} →
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {recentCases.map((caseItem) => (
                                    <div key={caseItem.id} className="p-5 rounded-3xl bg-brand-cream/30 dark:bg-neutral-800/50 border border-brand-green/5 hover:border-brand-green/20 transition-all group">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-bold text-brand-green dark:text-brand-tan">{caseItem.title}</h3>
                                            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[8px] font-black uppercase rounded-full tracking-wider">
                                                {caseItem.priority}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[8px] font-black uppercase rounded-full tracking-wider">
                                                {caseItem.status}
                                            </span>
                                            <span className="text-[10px] font-bold text-neutral-400">{caseItem.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Notice Card */}
                        <div className="p-8 bg-brand-green text-white rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="font-black text-xl mb-4 uppercase tracking-tighter">{t('safetyNotice')}</h3>
                                <p className="text-sm font-medium opacity-80 mb-6">{t('safetyText')}</p>
                                <Button className="bg-white text-brand-green w-full rounded-2xl font-black">{t('learnMore')}</Button>
                            </div>
                            <Scale className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
                        </div>
                    </div>
                </div>
            </div>
            <VoiceAssistant />
        </div>
    );
}

