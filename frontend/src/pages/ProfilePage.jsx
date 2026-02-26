import { useState } from "react";
import {
  Camera,
  ChevronRight,
  Globe,
  ShieldCheck,
  HelpCircle,
  LogOut
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { language, setLanguage } = useTheme();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "Rajesh Patel",
    phone: "+91 98765 43210",
    location: "Anand, Gujarat",
    land: "3 Acres",
    crops: "Wheat, Cotton",
    photo: null
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser({ ...user, photo: URL.createObjectURL(file) });
    }
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
    localStorage.setItem("selectedLanguage", value);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userName");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">

      <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-8">
        My Profile
      </h1>

      {/* USER CARD */}
      <div className="bg-white dark:bg-neutral-900 
                      rounded-2xl p-8 shadow-md 
                      border border-neutral-200 dark:border-neutral-700">

        <div className="flex flex-col md:flex-row items-center gap-6">

          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden flex items-center justify-center">
              {user.photo ? (
                <img
                  src={user.photo}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold">
                  {user.name[0]}
                </span>
              )}
            </div>

            <label className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full cursor-pointer shadow">
              <Camera size={16} color="white" />
              <input type="file" hidden onChange={handlePhotoUpload} />
            </label>
          </div>

          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {user.phone}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              {user.location}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              Land Holding: {user.land}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              Primary Crops: {user.crops}
            </p>
          </div>

        </div>
      </div>

      {/* SETTINGS */}
      <div className="mt-10 space-y-4">

        {/* Language */}
        <div className="flex items-center justify-between p-5 
                        bg-neutral-100 dark:bg-neutral-800 
                        rounded-2xl">

          <div className="flex items-center gap-3">
            <Globe />
            <span>Language</span>
          </div>

          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="border rounded px-3 py-1 
                       bg-white dark:bg-neutral-700 
                       dark:text-white dark:border-neutral-600"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="gu">ગુજરાતી</option>
          </select>
        </div>

        {/* Security */}
        <div className="flex items-center justify-between p-5 
                        bg-neutral-100 dark:bg-neutral-800 
                        rounded-2xl cursor-pointer hover:opacity-90">

          <div className="flex items-center gap-3">
            <ShieldCheck />
            <span>Security & Privacy</span>
          </div>
          <ChevronRight />
        </div>

        {/* Help */}
        <div className="flex items-center justify-between p-5 
                        bg-neutral-100 dark:bg-neutral-800 
                        rounded-2xl cursor-pointer hover:opacity-90">

          <div className="flex items-center gap-3">
            <HelpCircle />
            <span>Help & Support</span>
          </div>
          <ChevronRight />
        </div>

      </div>

      {/* ACCOUNT ACTIONS */}
      <div className="mt-12 border-t pt-8">

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2
                     bg-red-600 hover:bg-red-700
                     text-white font-semibold
                     py-3 rounded-2xl transition shadow"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </div>
  );
}