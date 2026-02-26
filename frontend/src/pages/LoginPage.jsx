import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, User, ArrowRight, ShieldCheck, Loader2, LockKeyhole } from 'lucide-react';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

export default function LoginPage() {
    const navigate = useNavigate();

    const [lang, setLang] = useState('hi');

    const translations = {
        en: {
            appName: "SAMJHAUTA SETU",
            tagline: "Providing Legal Clarity",
            phoneLabel: "Mobile Number",
            getOtp: "GET OTP",
            enterOtp: "Enter Verification Code",
            verify: "VERIFY LOGIN",
            changeNumber: "Change Number",
            guestMode: "Continue as Guest",
            invalidPhone: "Please enter a valid 10-digit number",
            invalidOtp: "Incorrect OTP. Please check SMS."
        },
        hi: {
            appName: "समझौता सेतु",
            tagline: "कानूनी स्पष्टता प्रदान करना",
            phoneLabel: "मोबाइल नंबर",
            getOtp: "ओटीपी प्राप्त करें",
            enterOtp: "वेरिफिकेशन कोड दर्ज करें",
            verify: "लॉगिन सत्यापित करें",
            changeNumber: "नंबर बदलें",
            guestMode: "अतिथि के रूप में जारी रखें",
            invalidPhone: "कृपया सही 10 अंकों का नंबर दर्ज करें",
            invalidOtp: "गलत ओटीपी। कृपया SMS देखें।"
        },
        gu: {
            appName: "સમજોતું સેતુ",
            tagline: "કાનૂની સ્પષ્ટતા પ્રદાન",
            phoneLabel: "મોબાઇલ નંબર",
            getOtp: "OTP મેળવો",
            enterOtp: "વેરિફિકેશન કોડ દાખલ કરો",
            verify: "લૉગિન ચકાસો",
            changeNumber: "નંબર બદલો",
            guestMode: "અતિથિ તરીકે આગળ વધો",
            invalidPhone: "કૃપા કરીને માન્ય 10 અંકનો નંબર દાખલ કરો",
            invalidOtp: "ખોટો OTP. કૃપા કરીને SMS તપાસો."
        }
    };

    const t = translations[lang];

    const [step, setStep] = useState('PHONE');
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible'
            });
        }
    }, []);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');

        if (phone.length !== 10) {
            setError(t.invalidPhone);
            return;
        }

        setLoading(true);
        const appVerifier = window.recaptchaVerifier;
        const formatPh = '+91' + phone;

        try {
            const confirmation = await signInWithPhoneNumber(auth, formatPh, appVerifier);
            setConfirmationResult(confirmation);
            setStep('OTP');
        } catch (err) {
            setError("SMS sending failed. Try again.");
        }

        setLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await confirmationResult.confirm(otp);

            localStorage.setItem('isAuthenticated', 'true');
            window.dispatchEvent(new Event('auth-update'));

            // ✅ FIXED NAVIGATION
            navigate('/');

        } catch (err) {
            setError(t.invalidOtp);
        }

        setLoading(false);
    };

    const handleGuest = () => {
        localStorage.setItem('isAuthenticated', 'guest');
        window.dispatchEvent(new Event('auth-update'));

        // ✅ FIXED NAVIGATION
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-brand-green dark:bg-[#0F110C] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">

            <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-tan/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

            <div id="recaptcha-container"></div>

            <div className="w-full max-w-md animate-slide-up relative z-10">
                <Card variant="glass" className="p-10 border-white/20 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">

                    {/* Header */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6">
                            <ShieldCheck className="w-12 h-12 text-brand-green" />
                        </div>

                        <h1 className="text-4xl font-black text-brand-green dark:text-brand-tan tracking-tighter uppercase mb-2">
                            {t.appName}
                        </h1>

                        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
                            {t.tagline}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                            <p className="text-xs font-bold text-red-500 uppercase tracking-wide">{error}</p>
                        </div>
                    )}

                    {/* PHONE FORM */}
                    {step === 'PHONE' ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-brand-brown dark:text-brand-tan uppercase tracking-widest px-1">
                                    {t.phoneLabel}
                                </label>

                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-lg">
                                        +91
                                    </div>

                                    <input
                                        type="tel"
                                        maxLength="10"
                                        placeholder="9876543210"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                        className="w-full pl-16 pr-6 py-5 bg-white/50 dark:bg-neutral-800/50 rounded-2xl border-2 border-transparent focus:border-brand-green focus:bg-white dark:focus:bg-neutral-800 outline-none font-bold text-xl transition-all"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-green hover:bg-brand-brown rounded-2xl py-8 text-xl font-black uppercase tracking-[0.2em] shadow-xl group disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : t.getOtp}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-brand-brown dark:text-brand-tan uppercase tracking-widest px-1 text-center block">
                                    {t.enterOtp}
                                </label>

                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400">
                                        <LockKeyhole className="w-5 h-5" />
                                    </div>

                                    <input
                                        type="text"
                                        maxLength="6"
                                        placeholder="------"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="w-full pl-14 pr-6 py-5 bg-white/50 dark:bg-neutral-800/50 rounded-2xl border-2 border-transparent focus:border-brand-green outline-none font-bold text-2xl tracking-[0.5em] text-center"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-brown hover:bg-brand-green rounded-2xl py-8 text-xl font-black uppercase tracking-[0.2em] shadow-xl"
                            >
                                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : t.verify}
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep('PHONE')}
                                className="w-full text-center text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-brand-green mt-4"
                            >
                                {t.changeNumber}
                            </button>
                        </form>
                    )}

                    {/* Guest */}
                    <div className="mt-8">
                        <button
                            onClick={handleGuest}
                            className="w-full p-4 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 hover:bg-white/20 text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
                        >
                            <User className="w-4 h-4" />
                            {t.guestMode}
                        </button>
                    </div>

                    {/* Language Switcher */}
                    <div className="mt-10 pt-8 border-t border-white/10">
                        <div className="flex flex-wrap justify-center gap-2">
                            {['en', 'hi', 'gu'].map(code => (
                                <button
                                    key={code}
                                    onClick={() => setLang(code)}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all ${
                                        lang === code
                                            ? 'bg-white text-brand-green'
                                            : 'text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    {code === 'en' ? 'English' : code === 'hi' ? 'हिन्दी' : 'ગુજરાતી'}
                                </button>
                            ))}
                        </div>
                    </div>

                </Card>
            </div>
        </div>
    );
}