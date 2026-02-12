import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, User, ArrowRight, ShieldCheck, Languages } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

export default function LoginPage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulation: Set default user if none exists
        localStorage.setItem('isAuthenticated', 'true');
        if (!localStorage.getItem('userName')) {
            localStorage.setItem('userName', 'किसान भाई');
        }
        navigate('/dashboard');
    };

    const handleGuest = () => {
        localStorage.setItem('isAuthenticated', 'guest');
        localStorage.setItem('userName', 'अतिथि किसान');
        navigate('/dashboard');
    };

    const languages = [
        { code: 'hi', label: 'हिन्दी' },
        { code: 'en', label: 'English' },
        { code: 'pa', label: 'ਪੰਜਾਬੀ' },
        { code: 'gu', label: 'ગુજરાતી' },
        { code: 'bh', label: 'भोजपुरी' },
        { code: 'kn', label: 'ಕನ್ನಡ' },
    ];

    return (
        <div className="min-h-screen bg-brand-green dark:bg-[#0F110C] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-tan/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

            <div className="w-full max-w-md animate-slide-up relative z-10">
                <Card variant="glass" className="p-10 border-white/20 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6 relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-green to-brand-brown opacity-0 group-hover:opacity-10 transition-opacity" />
                            <ShieldCheck className="w-12 h-12 text-brand-green" />
                        </div>
                        <h1 className="text-4xl font-black text-brand-green dark:text-brand-tan tracking-tighter uppercase mb-2">
                            {t('appName')}
                        </h1>
                        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
                            Samjhauta Setu | Providing Legal Clarity
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-brand-brown dark:text-brand-tan uppercase tracking-widest px-1">
                                {t('phoneLabel')}
                            </label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand-green transition-colors">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <input
                                    type="tel"
                                    placeholder={t('phonePlaceholder')}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-14 pr-6 py-5 bg-white/50 dark:bg-neutral-800/50 rounded-2xl border-2 border-transparent focus:border-brand-green focus:bg-white dark:focus:bg-neutral-800 outline-none font-bold transition-all placeholder:text-neutral-300 dark:text-white"
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-brand-green hover:bg-brand-brown rounded-2xl py-8 text-xl font-black uppercase tracking-[0.2em] shadow-xl group"
                        >
                            {t('login')}
                            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </form>

                    <div className="mt-8 flex flex-col gap-4">
                        <div className="relative py-4 flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-100 dark:border-neutral-800"></div></div>
                            <span className="relative px-4 bg-white/30 dark:bg-neutral-900/30 backdrop-blur-md rounded-full text-[10px] font-black text-neutral-400 uppercase tracking-widest">OR</span>
                        </div>

                        <button
                            onClick={handleGuest}
                            className="w-full p-4 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 hover:bg-white/20 text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
                        >
                            <User className="w-4 h-4" />
                            {t('guestMode')}
                        </button>
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/10">
                        <div className="flex flex-wrap justify-center gap-2">
                            {languages.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => i18n.changeLanguage(lang.code)}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all ${i18n.language === lang.code ? 'bg-white text-brand-green' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
