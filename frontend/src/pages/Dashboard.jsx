import { useState, useEffect } from 'react';
import { ArrowUpRight, ShieldCheck, Sprout, CloudSun, TrendingUp, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import MandiPrices from '../components/dashboard/MandiPrices';
import { getPIBNews } from '../services/api';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Dashboard() {
  const [userName] = useState(() => localStorage.getItem('userName') || 'Kisan Bhai');
  const [news, setNews] = useState([]);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const data = await getPIBNews(4);
        if (mounted) setNews(data.news || []);
      } catch (err) {
        console.error("News Fetch Error:", err);
        if (mounted) setNews([]);
      }
    };
    init();
    return () => { mounted = false };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F110C] pb-24 md:pb-12 transition-colors duration-500 font-sans">
      
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-green/10 to-transparent dark:from-brand-green/20 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto pt-8 md:pt-12 px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Welcome Hero Section */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeIn}
          className="relative overflow-hidden rounded-[2.5rem] bg-brand-green text-white p-10 md:p-14 shadow-2xl shadow-brand-green/20 border border-white/10"
        >
          {/* Decorative shapes */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-brand-tan/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wide">
                <Sprout className="w-4 h-4 text-brand-tan" />
                <span>Samjhauta Setu V2 Intelligence</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Welcome back, <br/>
                <span className="text-brand-tan">{userName}</span> 🙏
              </h1>
              <p className="text-brand-cream/80 text-lg md:text-xl font-light max-w-xl">
                Your AI-powered digital companion for transparent legal contracts and real-time agricultural insights.
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link to="/documents">
                <button className="group relative inline-flex items-center gap-3 px-8 py-5 bg-white text-brand-green rounded-2xl font-bold text-lg hover:bg-brand-tan hover:text-white transition-all duration-300 shadow-xl hover:shadow-brand-tan/30 hover:-translate-y-1 overflow-hidden">
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  <ShieldCheck className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">Scan Contract</span>
                  <ArrowUpRight className="w-5 h-5 relative z-10 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats / Overview */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <CloudSun className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-1">Weather Context</h3>
              <p className="text-neutral-900 dark:text-white font-medium">Optimal conditions for sowing Rabi crops.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-1">Market Trend</h3>
              <p className="text-neutral-900 dark:text-white font-medium">Wheat prices up by 2.4% this week in Punjab.</p>
            </div>
          </div>

          <Link to="/cases" className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-brand-green" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-1">Legal Health</h3>
              <p className="text-neutral-900 dark:text-white font-medium flex items-center gap-2">
                0 At-Risk Contracts <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* Left Column: Mandi Prices */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="lg:col-span-2 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
                <TrendingUp className="text-brand-green" /> Live Market Prices
              </h2>
              <Link to="/mandi" className="text-sm font-semibold text-brand-green hover:text-brand-brown transition-colors flex items-center gap-1">
                View All <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="bg-white dark:bg-neutral-900 rounded-[2rem] p-6 md:p-8 shadow-sm border border-neutral-200 dark:border-neutral-800">
              <MandiPrices compact />
            </div>
          </motion.div>

          {/* Right Column: News */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="space-y-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
              Latest Updates
            </h2>
            
            <div className="space-y-4">
              {news.length > 0 ? news.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-brand-green/30 transition-all duration-300"
                >
                  <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-3 line-clamp-3 group-hover:text-brand-green transition-colors leading-relaxed">
                    {item.title}
                  </h3>
                  <span className="text-xs font-bold flex items-center gap-1.5 text-brand-tan uppercase tracking-wider">
                    Read Article <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </span>
                </a>
              )) : (
                <div className="p-8 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-500">
                  <div className="animate-pulse flex flex-col items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                    <div className="w-3/4 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
                    <div className="w-1/2 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
