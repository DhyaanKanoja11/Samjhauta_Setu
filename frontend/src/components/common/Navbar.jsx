import { Home, FileText, Scale, User, Menu, X, Languages, ChevronDown, Moon, Sun, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const languages = [
        { code: 'hi', label: 'हिन्दी' },
        { code: 'en', label: 'English' },
        { code: 'pa', label: 'ਪੰਜਾਬੀ' },
        { code: 'gu', label: 'ગુજરાતી' },
        { code: 'bh', label: 'भोजपुरी' },
        { code: 'kn', label: 'ಕನ್ನಡ' },
    ];

    const navItems = [
        { path: '/dashboard', label: t('dashboard'), icon: Home },
        { path: '/mandi', label: t('mandiPrices'), icon: FileText },
        { path: '/cases', label: t('cases'), icon: Scale },
        { path: '/documents', label: t('legalPaperChecker') || 'Checker', icon: ShieldCheck },
        { path: '/profile', label: t('settings'), icon: User },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="bg-white shadow-soft sticky top-0 z-40 safe-top">
                <div className="container-custom">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/dashboard" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Scale className="w-6 h-6 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold text-brand-green font-display">{t('appName')}</h1>
                                <p className="text-[10px] text-neutral-500 font-medium tracking-widest uppercase">Samjhauta Setu</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive(item.path)
                                            ? 'bg-primary-50 text-primary-600 font-medium'
                                            : 'text-neutral-600 hover:bg-neutral-50'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Actions (Language & Theme) */}
                        <div className="flex items-center gap-2">
                            {/* Theme Toggle */}
                            <button
                                onClick={() => setIsDark(!isDark)}
                                className="p-2.5 bg-brand-cream/50 dark:bg-neutral-800 rounded-xl hover:bg-brand-cream dark:hover:bg-neutral-700 border border-transparent hover:border-brand-green/20 transition-all text-brand-green dark:text-brand-tan"
                                title={isDark ? 'Light Mode' : 'Dark Mode'}
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            {/* Language Switcher */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                    className="flex items-center gap-2 px-3 py-2 bg-brand-cream/50 rounded-xl hover:bg-brand-cream border border-transparent hover:border-brand-green/20 transition-all text-sm font-semibold text-brand-green"
                                >
                                    <Languages className="w-4 h-4" />
                                    <span>{languages.find(l => l.code === i18n.language)?.label || 'हिन्दी'}</span>
                                    <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isLangOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-neutral-100 rounded-2xl shadow-xl py-2 z-50 animate-slide-up">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    i18n.changeLanguage(lang.code);
                                                    setIsLangOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-brand-cream transition-colors ${i18n.language === lang.code ? 'text-brand-green font-bold bg-brand-green/5' : 'text-neutral-600'}`}
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 hover:bg-neutral-100 rounded-xl transition-colors"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-neutral-200 bg-white animate-slide-down">
                        <div className="container-custom py-4 space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path)
                                            ? 'bg-primary-50 text-primary-600 font-medium'
                                            : 'text-neutral-600 hover:bg-neutral-50'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </nav>

            {/* Bottom Navigation (Mobile Only) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 safe-bottom z-40">
                <div className="grid grid-cols-4 gap-1 p-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-all ${isActive(item.path)
                                    ? 'text-primary-600'
                                    : 'text-neutral-500'
                                    }`}
                            >
                                <Icon className="w-6 h-6" />
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
