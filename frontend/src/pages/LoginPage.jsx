import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, User, ArrowRight, ShieldCheck, Loader2, LockKeyhole } from 'lucide-react';
import { auth } from '../firebase'; // Ensure this points to your firebase.js
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

export default function LoginPage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    
    // UI States
    const [step, setStep] = useState('PHONE'); // 'PHONE' or 'OTP'
    const [loading, setLoading] = useState(false);
    
    // Data States
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [error, setError] = useState('');

    // 1. Initialize Invisible Recaptcha on Mount
    useEffect(() => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: () => {
                    // Recaptcha solved
                },
                'expired-callback': () => {
                    setError('Recaptcha expired. Please refresh.');
                }
            });
        }
    }, []);

    // 2. Handle Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');

        if (phone.length !== 10) {
            setError(t('invalidPhone', 'Please enter a valid 10-digit number'));
            return;
        }

        setLoading(true);
        const appVerifier = window.recaptchaVerifier;
        const formatPh = '+91' + phone;

        try {
            const confirmation = await signInWithPhoneNumber(auth, formatPh, appVerifier);
            setConfirmationResult(confirmation);
            setStep('OTP'); // Switch UI to OTP mode
        } catch (err) {
            console.error(err);
            setError('SMS sending failed. Try again.');
        }
        setLoading(false);
    };

    // 3. Handle Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await confirmationResult.confirm(otp);
            const user = res.user; // Firebase returns the user details here
            
            // Success! Mark as authenticated
            localStorage.setItem('isAuthenticated', 'true');
            window.dispatchEvent(new Event('auth-update'));

            // CHECK: Is this a returning user or a new user?
            const existingProfile = localStorage.getItem('userProfile');
            
            if (existingProfile) {
                // RETURNING USER: Send them straight to the Dashboard
                navigate('/dashboard');
            } else {
                // NEW USER: Create a blank profile using their verified phone number
                const newProfile = {
                    firstName: '',
                    lastName: '',
                    phone: user.phoneNumber, // Firebase gives us the +91 number securely
                    location: '',
                    landSize: '',
                    mainCrops: '',
                    language: i18n.language || 'hi'
                };
                
                localStorage.setItem('userProfile', JSON.stringify(newProfile));
                localStorage.setItem('userName', 'किसान'); // Temporary name
                
                // Send them to Profile page AND pass a secret message that they are new
                navigate('/profile', { state: { isNewUser: true } });
            }
        } catch (err) {
            console.error(err);
            setError(t('invalidOtp', 'Incorrect OTP. Please check SMS.'));
        }
        setLoading(false);
    };

    // 4. Guest Mode (Kept from your code)
    const handleGuest = () => {
        localStorage.setItem('isAuthenticated', 'guest');
        window.dispatchEvent(new Event('auth-update'));
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

            {/* Hidden Recaptcha Element */}
            <div id="recaptcha-container"></div>

            <div className="w-full max-w-md animate-slide-up relative z-10">
                <Card variant="glass" className="p-10 border-white/20 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
                    
                    {/* Header Section */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6 relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-green to-brand-brown opacity-0 group-hover:opacity-10 transition-opacity" />
                            <ShieldCheck className="w-12 h-12 text-brand-green" />
                        </div>
                        <h1 className="text-4xl font-black text-brand-green dark:text-brand-tan tracking-tighter uppercase mb-2">
                            {t('appName', 'SAMJHAUTA SETU')}
                        </h1>
                        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
                            Providing Legal Clarity
                        </p>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                            <p className="text-xs font-bold text-red-500 uppercase tracking-wide">{error}</p>
                        </div>
                    )}

                    {/* DYNAMIC FORM AREA */}
                    {step === 'PHONE' ? (
                        // --- PHONE FORM ---
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-brand-brown dark:text-brand-tan uppercase tracking-widest px-1">
                                    {t('phoneLabel', 'Mobile Number')}
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand-green transition-colors font-bold text-lg">
                                        +91
                                    </div>
                                    <input
                                        type="tel"
                                        maxLength="10"
                                        placeholder="9876543210"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                        className="w-full pl-16 pr-6 py-5 bg-white/50 dark:bg-neutral-800/50 rounded-2xl border-2 border-transparent focus:border-brand-green focus:bg-white dark:focus:bg-neutral-800 outline-none font-bold text-xl transition-all placeholder:text-neutral-300 dark:text-white"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-brand-green hover:bg-brand-brown rounded-2xl py-8 text-xl font-black uppercase tracking-[0.2em] shadow-xl group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                                    <>
                                        {t('getOtp', 'GET OTP')}
                                        <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    ) : (
                        // --- OTP FORM ---
                        <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-brand-brown dark:text-brand-tan uppercase tracking-widest px-1 text-center block">
                                    {t('enterOtp', 'Enter Verification Code')}
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand-green transition-colors">
                                        <LockKeyhole className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        maxLength="6"
                                        placeholder="------"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="w-full pl-14 pr-6 py-5 bg-white/50 dark:bg-neutral-800/50 rounded-2xl border-2 border-transparent focus:border-brand-green focus:bg-white dark:focus:bg-neutral-800 outline-none font-bold text-2xl tracking-[0.5em] text-center transition-all placeholder:text-neutral-300 dark:text-white"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-brand-brown hover:bg-brand-green rounded-2xl py-8 text-xl font-black uppercase tracking-[0.2em] shadow-xl group disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                                    <>
                                        {t('verify', 'VERIFY LOGIN')}
                                        <ShieldCheck className="w-6 h-6 ml-2" />
                                    </>
                                )}
                            </Button>
                            
                            <button 
                                type="button" 
                                onClick={() => setStep('PHONE')}
                                className="w-full text-center text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-brand-green mt-4"
                            >
                                {t('changeNumber', 'Change Number')}
                            </button>
                        </form>
                    )}

                    {/* Footer Actions (Guest & Lang) */}
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
                            {t('guestMode', 'Continue as Guest')}
                        </button>
                    </div>

                    {/* Language Switcher */}
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
