import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, User, ArrowRight, ShieldCheck, Loader2, LockKeyhole } from 'lucide-react';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

export default function LoginPage() {
    const navigate = useNavigate();

    const [step, setStep] = useState('PHONE');
    const [loading, setLoading] = useState(false);

    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [error, setError] = useState('');

    const [language, setLanguage] = useState('hi');

    // 🔥 Built-in Translations
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

    const tr = translations[language];

    useEffect(() => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: () => {},
                'expired-callback': () => {
                    setError('Recaptcha expired. Please refresh.');
                }
            });
        }
    }, []);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');

        if (phone.length !== 10) {
            setError(tr.invalidPhone);
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
            console.error(err);
            setError('SMS sending failed. Try again.');
        }

        setLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await confirmationResult.confirm(otp);
            const user = res.user;

            localStorage.setItem('isAuthenticated', 'true');
            window.dispatchEvent(new Event('auth-update'));

            const existingProfile = localStorage.getItem('userProfile');

            if (existingProfile) {
                navigate('/dashboard');
            } else {
                const newProfile = {
                    firstName: '',
                    lastName: '',
                    phone: user.phoneNumber,
                    location: '',
                    landSize: '',
                    mainCrops: '',
                    language: language
                };

                localStorage.setItem('userProfile', JSON.stringify(newProfile));
                localStorage.setItem('userName', 'किसान');
                navigate('/profile', { state: { isNewUser: true } });
            }

        } catch (err) {
            console.error(err);
            setError(tr.invalidOtp);
        }

        setLoading(false);
    };

    const handleGuest = () => {
        localStorage.setItem('isAuthenticated', 'guest');
        localStorage.setItem('userName', 'अतिथि किसान');
        window.dispatchEvent(new Event('auth-update'));
        navigate('/dashboard');
    };

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'हिन्दी' },
        { code: 'gu', label: 'ગુજરાતી' },
    ];

    return (
        <div className="min-h-screen bg-brand-green dark:bg-[#0F110C] flex items-center justify-center p-4 relative overflow-hidden">

            <div id="recaptcha-container"></div>

            <div className="w-full max-w-md relative z-10">
                <Card variant="glass" className="p-10">

                    <div className="flex flex-col items-center mb-10">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6">
                            <ShieldCheck className="w-12 h-12 text-brand-green" />
                        </div>
                        <h1 className="text-4xl font-black text-brand-green dark:text-brand-tan tracking-tight mb-2">
                            {tr.appName}
                        </h1>
                        <p className="text-xs uppercase font-bold tracking-widest text-neutral-400">
                            {tr.tagline}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                            <p className="text-xs font-bold text-red-500">{error}</p>
                        </div>
                    )}

                    {step === 'PHONE' ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wide">
                                    {tr.phoneLabel}
                                </label>
                                <div className="relative mt-2">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-lg">
                                        +91
                                    </div>
                                    <input
                                        type="tel"
                                        maxLength="10"
                                        placeholder="9876543210"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                        className="w-full pl-16 pr-6 py-4 rounded-2xl border focus:border-brand-green outline-none font-bold text-lg"
                                    />
                                </div>
                            </div>

                            <Button type="submit" disabled={loading} className="w-full py-6 text-lg font-bold uppercase">
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : tr.getOtp}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wide block text-center">
                                    {tr.enterOtp}
                                </label>
                                <input
                                    type="text"
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="w-full mt-4 py-4 rounded-2xl border text-center text-xl font-bold tracking-widest"
                                />
                            </div>

                            <Button type="submit" disabled={loading} className="w-full py-6 text-lg font-bold uppercase">
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : tr.verify}
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep('PHONE')}
                                className="w-full text-center text-xs font-bold uppercase mt-2"
                            >
                                {tr.changeNumber}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center">
                        <button
                            onClick={handleGuest}
                            className="text-sm font-bold uppercase"
                        >
                            {tr.guestMode}
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t text-center">
                        <div className="flex justify-center gap-2">
                            {languages.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => setLanguage(lang.code)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        language === lang.code
                                            ? 'bg-white text-brand-green'
                                            : 'text-white/60'
                                    }`}
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