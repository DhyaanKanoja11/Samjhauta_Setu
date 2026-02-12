import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Scale, Clock, CheckCircle, Plus, Filter, Search } from 'lucide-react';
import VoiceAssistant from '../components/dashboard/VoiceAssistant';
import { useTranslation } from 'react-i18next';

export default function CasesPage() {
    const { t } = useTranslation();
    const cases = [
        {
            id: 1,
            title: 'भूमि विवाद - खसरा 456',
            description: 'पड़ोसी के साथ सीमा विवाद',
            status: 'चल रहा है',
            priority: 'उच्च',
            date: '2024-02-10',
            parties: ['राजेश कुमार', 'सुरेश शर्मा'],
        },
        {
            id: 2,
            title: 'फसल बीमा दावा',
            description: 'ओलावृष्टि से फसल क्षति',
            status: 'समीक्षा में',
            priority: 'मध्यम',
            date: '2024-02-07',
            parties: ['राजेश कुमार', 'बीमा कंपनी'],
        },
        {
            id: 3,
            title: 'पानी के अधिकार',
            description: 'सिंचाई नहर का उपयोग',
            status: 'हल हो गया',
            priority: 'निम्न',
            date: '2024-02-01',
            parties: ['राजेश कुमार', 'ग्राम पंचायत'],
        },
    ];

    return (
        <div className="min-h-screen bg-brand-cream/10 dark:bg-[#0F110C] pb-24 md:pb-8 transition-colors duration-300">
            <div className="container-custom py-10 md:py-16 space-y-10">
                {/* Header Section */}
                <div className="relative overflow-hidden bg-brand-green dark:bg-neutral-800 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black tracking-widest uppercase">
                                <Scale className="w-3 h-3 text-brand-tan" />
                                {t('activeCases')}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white mb-2 uppercase">
                                {t('casesTitle')}
                            </h1>
                            <p className="text-brand-cream/70 text-lg font-medium max-w-xl">
                                {t('casesSubtitle')}
                            </p>
                        </div>
                        <Button size="lg" className="bg-white text-brand-green hover:bg-brand-tan hover:text-white border-none shadow-2xl text-[10px] px-8 h-16 rounded-3xl font-black transition-all uppercase tracking-widest">
                            <Plus className="w-6 h-6 mr-2" />
                            {t('newCase')}
                        </Button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-8 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        {[t('all'), t('active'), t('review'), t('resolved')].map((tab, i) => (
                            <button
                                key={tab}
                                className={`px-6 py-3 rounded-2xl text-[10px] font-black whitespace-nowrap transition-all uppercase tracking-widest ${i === 0 ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'bg-white dark:bg-neutral-800 text-neutral-500 border border-neutral-100 dark:border-neutral-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="lg:col-span-4 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-brand-green transition-colors" />
                        <input
                            type="text"
                            placeholder={t('searchCase')}
                            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 font-bold shadow-sm"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 gap-6">
                    {cases.map((caseItem) => (
                        <Card
                            key={caseItem.id}
                            variant="glass"
                            className="p-8 group hover:scale-[1.01] transition-all duration-500 hover:border-brand-green/30"
                        >
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-inner ${caseItem.status === t('resolved') ? 'bg-green-50 text-green-600' :
                                    caseItem.status === t('active') ? 'bg-orange-50 text-orange-600' :
                                        'bg-blue-50 text-blue-600'
                                    }`}>
                                    <Scale className="w-10 h-10" />
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-black text-brand-green dark:text-brand-tan group-hover:text-brand-brown transition-colors">
                                                {caseItem.title}
                                            </h3>
                                            <p className="text-neutral-500 font-medium">{caseItem.description}</p>
                                        </div>
                                        <span className="px-4 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-black uppercase rounded-full tracking-widest border border-red-200 dark:border-red-800">
                                            {caseItem.priority} {t('priority')}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-brand-green/5">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{t('status')}</p>
                                            <div className="flex items-center gap-2 font-bold text-brand-green">
                                                <Clock className="w-4 h-4" />
                                                {caseItem.status}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{t('regDate')}</p>
                                            <div className="font-bold text-neutral-700 dark:text-neutral-300">
                                                {new Date(caseItem.date).toLocaleDateString(t('locale') || 'hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>
                                        <div className="space-y-1 sm:col-span-2">
                                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{t('mainParties')}</p>
                                            <div className="font-bold text-neutral-700 dark:text-neutral-300">
                                                {caseItem.parties.join(` ${t('vs')} `)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
            <VoiceAssistant />
        </div>
    );
}

