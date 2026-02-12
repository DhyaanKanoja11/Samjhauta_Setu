import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, MapPin, Sprout, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

export default function SignupPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        location: '',
        crops: ''
    });

    const handleSignup = (e) => {
        e.preventDefault();
        localStorage.setItem('userProfile', JSON.stringify({
            ...formData,
            landSize: '2.5', // Default
            language: 'hi'
        }));
        localStorage.setItem('userName', `${formData.firstName} ${formData.lastName}`);
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-brand-green dark:bg-[#0F110C] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />

            <div className="w-full max-w-xl animate-slide-up relative z-10">
                <Card variant="glass" className="p-8 md:p-12 border-white/20 shadow-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-brand-green dark:text-brand-tan tracking-tighter uppercase mb-2">
                            {t('joinUs')}
                        </h1>
                        <p className="text-[10px] uppercase font-black tracking-widest text-neutral-400">
                            Empowering your farming journey
                        </p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-brand-brown dark:text-brand-tan uppercase tracking-widest px-1">
                                    {t('firstNameLabel')}
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                    <input
                                        required
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        placeholder={t('firstNamePlaceholder')}
                                        className="w-full pl-12 pr-6 py-4 bg-white/50 dark:bg-neutral-800/50 rounded-2xl border-2 border-transparent focus:border-brand-green outline-none font-bold transition-all dark:text-white placeholder:text-neutral-300"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-brand-brown dark:text-brand-tan uppercase tracking-widest px-1">
                                    {t('lastNameLabel')}
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    placeholder={t('lastNamePlaceholder')}
                                    className="w-full px-6 py-4 bg-white/50 dark:bg-neutral-800/50 rounded-2xl border-2 border-transparent focus:border-brand-green outline-none font-bold transition-all dark:text-white placeholder:text-neutral-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-brand-brown dark:text-brand-tan uppercase tracking-widest px-1">
                                {t('locationLabel')}
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    required
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder={t('locationPlaceholder')}
                                    className="w-full pl-12 pr-6 py-4 bg-white/50 dark:bg-neutral-800/50 rounded-2xl border-2 border-transparent focus:border-brand-green outline-none font-bold transition-all dark:text-white placeholder:text-neutral-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-brand-brown dark:text-brand-tan uppercase tracking-widest px-1">
                                {t('cropsLabel')}
                            </label>
                            <div className="relative">
                                <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    required
                                    type="text"
                                    value={formData.crops}
                                    onChange={(e) => setFormData({ ...formData, crops: e.target.value })}
                                    placeholder={t('cropsPlaceholder')}
                                    className="w-full pl-12 pr-6 py-4 bg-white/50 dark:bg-neutral-800/50 rounded-2xl border-2 border-transparent focus:border-brand-green outline-none font-bold transition-all dark:text-white placeholder:text-neutral-300"
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-brand-green hover:bg-brand-brown rounded-2xl py-6 text-lg font-black uppercase tracking-widest shadow-xl group"
                        >
                            {t('signup')}
                            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-xs font-bold text-neutral-400">
                        {t('haveAccount')} <Link to="/login" className="text-brand-green hover:underline">{t('login')}</Link>
                    </p>
                </Card>
            </div>
        </div>
    );
}
