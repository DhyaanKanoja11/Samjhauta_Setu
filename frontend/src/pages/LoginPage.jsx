import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, User, ArrowRight, ShieldCheck, Loader2, LockKeyhole } from 'lucide-react';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

export default function LoginPage() {
    const navigate = useNavigate();

    // 🔥 SIMPLE INTERNAL LANGUAGE STATE
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
            setError("SMS sending failed.");
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
            navigate('/dashboard');

        } catch (err) {
            setError(t.invalidOtp);
        }

        setLoading(false);
    };

    const handleGuest = () => {
        localStorage.setItem('isAuthenticated', 'guest');
        window.dispatchEvent(new Event('auth-update'));
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-brand-green dark:bg-[#0F110C] flex items-center justify-center p-4 relative overflow-hidden">

            <div id="recaptcha-container"></div>

            <div className="w-full max-w-md relative z-10">
                <Card variant="glass" className="p-10 border-white/20">

                    {/* Header */}
                    <div className="flex flex-col items-center mb-10">
                        <ShieldCheck className="w-12 h-12 text-brand-green mb-4" />
                        <h1 className="text-4xl font-black text-brand-green dark:text-brand-tan uppercase mb-2">
                            {t.appName}
                        </h1>
                        <p className="text-[10px] uppercase font-black tracking-widest text-neutral-400">
                            {t.tagline}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 text-red-500 text-center font-bold text-xs">
                            {error}
                        </div>
                    )}

                    {step === 'PHONE' ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">

                            <label className="text-xs font-bold uppercase">
                                {t.phoneLabel}
                            </label>

                            <input
                                type="tel"
                                maxLength="10"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                className="w-full p-4 rounded-2xl border"
                                placeholder="9876543210"
                            />

                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? <Loader2 className="animate-spin" /> : t.getOtp}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">

                            <label className="text-xs font-bold uppercase text-center block">
                                {t.enterOtp}
                            </label>

                            <input
                                type="text"
                                maxLength="6"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="w-full p-4 rounded-2xl border text-center"
                            />

                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? <Loader2 className="animate-spin" /> : t.verify}
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep('PHONE')}
                                className="w-full text-xs mt-2"
                            >
                                {t.changeNumber}
                            </button>
                        </form>
                    )}

                    <div className="mt-6">
                        <button
                            onClick={handleGuest}
                            className="w-full p-4 rounded-2xl bg-white/10 text-white font-bold text-xs uppercase"
                        >
                            {t.guestMode}
                        </button>
                    </div>

                    {/* Language Switch */}
                    <div className="mt-8 flex justify-center gap-3">
                        <button onClick={() => setLang('en')} className="text-xs font-bold">English</button>
                        <button onClick={() => setLang('hi')} className="text-xs font-bold">हिन्दी</button>
                        <button onClick={() => setLang('gu')} className="text-xs font-bold">ગુજરાતી</button>
                    </div>

                </Card>
            </div>
        </div>
    );
}