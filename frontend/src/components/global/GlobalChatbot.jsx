import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function GlobalChatbot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 md:bottom-6 right-6 
                   bg-green-600 text-white 
                   p-4 rounded-full shadow-lg z-50 
                   hover:scale-105 transition"
      >
        {open ? <X /> : <MessageCircle />}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-32 md:bottom-20 right-6 
                     w-[90%] md:w-[380px] 
                     h-[500px] 
                     bg-white dark:bg-neutral-900 
                     rounded-2xl shadow-2xl 
                     border border-neutral-200 dark:border-neutral-700 
                     z-50 flex flex-col"
        >
          <div className="p-4 border-b dark:border-neutral-700 font-semibold">
            Agri Assistant
          </div>

          <div className="flex-1 p-4 overflow-y-auto text-sm">
            Chat interface here...
          </div>

          <div className="p-3 border-t dark:border-neutral-700">
            <input
              placeholder="Type your question..."
              className="w-full border rounded-lg px-3 py-2 
                         dark:bg-neutral-800 dark:text-white"
            />
          </div>
        </div>
      )}
    </>
  );
}   