import { useState } from "react";
import { ChevronRight, ShieldCheck, Globe, HelpCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ProfilePage() {

  const [activePanel, setActivePanel] = useState(null);

  const { language, setLanguage, darkMode, setDarkMode } = useTheme();

  return (
    <div className="min-h-screen py-10">

      <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-6">
        Profile Settings
      </h1>

      {/* SETTINGS BUTTONS */}
      <div className="space-y-4">

        {/* Language */}
        <button
          onClick={() => setActivePanel("language")}
          className="w-full flex items-center justify-between p-5 rounded-2xl 
                     bg-neutral-100 dark:bg-neutral-800 
                     hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
        >
          <div className="flex items-center gap-3">
            <Globe />
            <span>Language Settings</span>
          </div>
          <ChevronRight />
        </button>

        {/* Security */}
        <button
          onClick={() => setActivePanel("security")}
          className="w-full flex items-center justify-between p-5 rounded-2xl 
                     bg-neutral-100 dark:bg-neutral-800 
                     hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck />
            <span>Security & Privacy</span>
          </div>
          <ChevronRight />
        </button>

        {/* Help */}
        <button
          onClick={() => setActivePanel("help")}
          className="w-full flex items-center justify-between p-5 rounded-2xl 
                     bg-neutral-100 dark:bg-neutral-800 
                     hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
        >
          <div className="flex items-center gap-3">
            <HelpCircle />
            <span>Help & Support</span>
          </div>
          <ChevronRight />
        </button>

      </div>

      {/* MODAL PANEL */}
      {activePanel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 w-[90%] max-w-md">

            {/* Close */}
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {activePanel === "language" && "Language Settings"}
                {activePanel === "security" && "Security & Privacy"}
                {activePanel === "help" && "Help & Support"}
              </h2>
              <button onClick={() => setActivePanel(null)}>✕</button>
            </div>

            {/* LANGUAGE PANEL */}
            {activePanel === "language" && (
              <div className="space-y-4">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full border rounded px-3 py-2 
                             bg-white dark:bg-neutral-800 
                             dark:text-white dark:border-neutral-600"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                  <option value="gu">ગુજરાતી</option>
                </select>
              </div>
            )}

            {/* SECURITY PANEL */}
            {activePanel === "security" && (
              <div className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
                <p>• All documents are encrypted.</p>
                <p>• Data stored securely on protected cloud servers.</p>
                <p>• No public visibility of disputes.</p>

                <div className="flex items-center justify-between mt-4">
                  <span>Dark Mode</span>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg"
                  >
                    Toggle
                  </button>
                </div>
              </div>
            )}

            {/* HELP PANEL */}
            {activePanel === "help" && (
              <div className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
                <p>For assistance, contact:</p>
                <p className="font-semibold">support@samjhautasetu.in</p>
                <p>Helpline: 1800-000-000</p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}