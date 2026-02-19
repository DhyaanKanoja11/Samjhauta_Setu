import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom'; // ADDED for redirection
import { User, MapPin, Phone, ShieldCheck, Sprout, ShoppingBag, Award, Camera, ChevronRight, Save, LogOut } from 'lucide-react'; // ADDED LogOut icon
import { auth } from '../firebase'; // ADDED Firebase auth
import { signOut } from 'firebase/auth'; // ADDED Firebase signOut function
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import VoiceAssistant from '../components/dashboard/VoiceAssistant';

export default function ProfilePage() {
    const { t } = useTranslation();
    const navigate = useNavigate(); // Initialize navigation
    
    const [profile, setProfile] = useState(() => {
        const saved = localStorage.getItem('userProfile');
        return saved ? JSON.parse(saved) : {
            firstName: 'राजेश',
            lastName: 'कुमार',
            phone: '9876543210',
            location: 'मेरठ, उत्तर प्रदेश',
            landSize: '2.5',
            mainCrops: 'गेहूं, धान, गन्ना',
            language: 'hi'
        }
    });
    const location = useLocation(); // Get current location for potential use in redirection logic
    const [isEditing, setIsEditing] = useState(location.state?.isNewUser || false);

    const handleSave = () => {
        localStorage.setItem('userProfile', JSON.stringify(profile));
        localStorage.setItem('userName', `${profile.firstName} ${profile.lastName}`);
        setIsEditing(false);
        window.dispatchEvent(new Event('storage'));
    };

    // ADDED: Logout Logic
    const handleLogout = async () => {
        try {
            // 1. Sign out from Firebase cloud
            await signOut(auth);
            
            // 2. Clear local storage session data
            localStorage.removeItem('isAuthenticated');
            window.dispatchEvent(new Event('auth-update'));
            localStorage.removeItem('userName');
            // Optional: localStorage.removeItem('userProfile'); if you want to clear their saved data from the device
            
            // 3. Redirect back to the login page
            navigate('/');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="min-h-screen bg-brand-cream/10 dark:bg-[#0F110C] pb-24 md:pb-8 transition-colors duration-300">
            <div className="container-custom py-12 space-y-12">
                <header className="space-y-4">
                    <h1 className="text-5xl font-black text-brand-green dark:text-brand-tan tracking-tight">
                        {t('myProfile', 'My Profile')}
                    </h1>
                    <p className="text-neutral-500 font-medium tracking-wide uppercase text-[10px]">
                        {t('profileSubtitle', 'Manage your farming details')}
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4 space-y-6">
                        <Card variant="glass" className="text-center p-10 relative overflow-hidden group">
                            <div className="relative z-10 space-y-6">
                                <div className="relative w-32 h-32 mx-auto">
                                    <div className="w-full h-full bg-brand-green/10 rounded-full flex items-center justify-center border-4 border-brand-green/20 overflow-hidden">
                                        <User className="w-16 h-16 text-brand-green" />
                                    </div>
                                    <button className="absolute bottom-1 right-1 p-2 bg-brand-green text-white rounded-full shadow-lg hover:scale-110 transition-all">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-brand-green dark:text-brand-tan uppercase tracking-tighter">
                                        {profile.firstName} {profile.lastName}
                                    </h2>
                                    <p className="text-neutral-500 font-bold flex items-center justify-center gap-2">
                                        <MapPin className="w-4 h-4" /> {profile.location}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setIsEditing(!isEditing)}
                                    variant={isEditing ? 'outline' : 'default'}
                                    className="w-full rounded-2xl font-black uppercase tracking-widest text-[10px] py-4"
                                >
                                    {isEditing ? t('cancel', 'Cancel') : t('editProfile', 'Edit Profile')}
                                </Button>
                            </div>
                            <Sprout className="absolute -bottom-8 -right-8 w-32 h-32 opacity-5 text-brand-green group-hover:rotate-12 transition-transform duration-700" />
                        </Card>

                        <div className="space-y-3">
                            {[
                                { label: t('langSettings', 'Language'), key: 'language' },
                                { label: t('securitySettings', 'Security'), key: 'security' },
                                { label: t('helpSupport', 'Help & Support'), key: 'help' }
                            ].map((item) => (
                                <button 
                                    key={item.key} 
                                    className="flex items-center justify-between w-full p-5 rounded-3xl bg-white dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700 hover:border-brand-green transition-all group"
                                >
                                    <span className="font-bold text-neutral-600 dark:text-neutral-400 group-hover:text-brand-green transition-colors">
                                        {item.label}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                                </button>
                            ))}

                            {/* ADDED: Logout Button */}
                            <button 
                                onClick={handleLogout}
                                className="flex items-center justify-between w-full p-5 rounded-3xl bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 hover:bg-red-500/10 dark:hover:bg-red-500/20 hover:border-red-500/40 transition-all group mt-6"
                            >
                                <span className="font-bold text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">
                                    {t('logout', 'लॉग आउट / Logout')}
                                </span>
                                <LogOut className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* ... (Keep your entire lg:col-span-8 Card code exactly the same) ... */}
                    <div className="lg:col-span-8">
                        <Card variant="glass" className="p-8 md:p-12 space-y-10 border-t-8 border-t-brand-green">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-brand-brown dark:text-brand-tan uppercase tracking-widest px-1">
                                        {t('firstNameLabel', 'First Name')}
                                    </label>
                                    <input
                                        disabled={!isEditing}
                                        type="text"
                                        value={profile.firstName}
                                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                        placeholder={t('firstNamePlaceholder')}
                                        className="w-full px-6 py-4 bg-white/50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-700 focus:border-brand-green outline-none font-bold transition-all disabled:opacity-50 dark:text-white placeholder:text-neutral-300"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-brand-brown dark:text-brand-tan uppercase tracking-widest px-1">
                                        {t('lastNameLabel', 'Last Name')}
                                    </label>
                                    <input
                                        disabled={!isEditing}
                                        type="text"
                                        value={profile.lastName}
                                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                        placeholder={t('lastNamePlaceholder')}
                                        className="w-full px-6 py-4 bg-white/50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-700 focus:border-brand-green outline-none font-bold transition-all disabled:opacity-50 dark:text-white placeholder:text-neutral-300"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-brand-brown dark:text-brand-tan uppercase tracking-widest px-1">
                                        {t('landSizeLabel', 'Land Size (Acres)')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            disabled={!isEditing}
                                            type="text"
                                            value={profile.landSize}
                                            onChange={(e) => setProfile({ ...profile, landSize: e.target.value })}
                                            placeholder={t('landSizePlaceholder')}
                                            className="w-full px-6 py-4 bg-white/50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-700 focus:border-brand-green outline-none font-bold transition-all disabled:opacity-50 dark:text-white placeholder:text-neutral-300"
                                        />
                                        <Sprout className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-green/30" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-brand-brown dark:text-brand-tan uppercase tracking-widest px-1">
                                        {t('cropsLabel', 'Main Crops')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            disabled={!isEditing}
                                            type="text"
                                            value={profile.mainCrops}
                                            onChange={(e) => setProfile({ ...profile, mainCrops: e.target.value })}
                                            placeholder={t('cropsPlaceholder')}
                                            className="w-full px-6 py-4 bg-white/50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-700 focus:border-brand-green outline-none font-bold transition-all disabled:opacity-50 dark:text-white placeholder:text-neutral-300"
                                        />
                                        <ShoppingBag className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-green/30" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-neutral-100 dark:border-neutral-800">
                                <h3 className="text-sm font-black text-brand-brown dark:text-brand-tan uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Award className="w-5 h-5" /> {t('activeSchemes', 'Active Schemes')}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {['PM-KISAN', 'Crop Insurance', 'Soil Health'].map(scheme => (
                                        <div key={scheme} className="p-4 bg-green-500/5 dark:bg-green-500/10 rounded-2xl border border-green-500/20 text-center">
                                            <p className="text-[10px] font-black text-green-600 uppercase tracking-tighter mb-1">{scheme}</p>
                                            <p className="text-xs font-bold text-green-700/70">{t('activeStatus', 'Active')}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {isEditing && (
                                <Button
                                    onClick={handleSave}
                                    className="w-full bg-brand-green hover:bg-brand-brown rounded-[2rem] py-8 text-xl font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95"
                                >
                                    <Save className="w-6 h-6 mr-2" />
                                    {t('saveProfile', 'Save Profile')}
                                </Button>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
            <VoiceAssistant />
        </div>
    );
}
