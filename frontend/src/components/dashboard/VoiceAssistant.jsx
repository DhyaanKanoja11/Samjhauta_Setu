import { useState, useEffect, useRef } from "react";
import { MessageSquare, Mic, X, Send } from "lucide-react";
import * as API from "../../services/api";

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // ✅ Initial Greeting
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: "Namaste! I am your Agri Assistant. Ask about mandi prices or weather.",
        sender: "bot",
      },
    ]);
  }, []);

  // ✅ Use the same language key that your API uses: selectedLanguage
  // Fallbacks included so it still works if navbar uses "language"
  const getLangKey = () =>
    localStorage.getItem("selectedLanguage") ||
    localStorage.getItem("language") ||
    "en";

  const getSpeechLang = () => {
    const map = { en: "en-IN", hi: "hi-IN", gu: "gu-IN" };
    return map[getLangKey()] || "en-IN";
  };

  // 🔊 TEXT TO SPEECH
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;

    // Stop any currently speaking voice
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = getSpeechLang();
    utter.rate = 1;
    utter.pitch = 1;

    window.speechSynthesis.speak(utter);
  };

  const addBotMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), text, sender: "bot" },
    ]);

    // Speak response
    speakText(text);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), text, sender: "user" },
    ]);
  };

  const isWeatherQuery = (text) => {
    const q = text.toLowerCase();
    return (
      q.includes("weather") ||
      q.includes("mausam") ||
      text.includes("मौसम") ||
      text.includes("હવામાન")
    );
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    addUserMessage(text);
    setInput("");
    setIsLoading(true);

    try {
      // 🌤 WEATHER FLOW
      if (isWeatherQuery(text)) {
        if (!navigator.geolocation) {
          addBotMessage("Geolocation is not supported in this browser.");
          setIsLoading(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const response = await API.chatWithWeather(
                pos.coords.latitude,
                pos.coords.longitude
              );
              addBotMessage(response?.text || "Weather data unavailable.");
            } catch (err) {
              console.error(err);
              addBotMessage("Weather fetch failed.");
            } finally {
              setIsLoading(false);
            }
          },
          () => {
            addBotMessage("Location permission denied. Please allow location access.");
            setIsLoading(false);
          }
        );

        return;
      }

      // 💬 NORMAL CHAT FLOW
      const response = await API.chatWithBot(text);
      addBotMessage(response?.text || "No response received.");
    } catch (error) {
      console.error("Chat error:", error);
      addBotMessage("Something went wrong. Please try again.");
    } finally {
      if (!isWeatherQuery(text)) setIsLoading(false);
    }
  };

  // 🎤 SPEECH TO TEXT (robust)
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      addBotMessage("Voice input not supported on this browser. Use Chrome on Android/Desktop.");
      return;
    }

    // Stop any speaking voice when user starts talking (better UX)
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();

    const recognition = new SpeechRecognition();
    recognition.lang = getSpeechLang();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event?.results?.[0]?.[0]?.transcript || "";
      if (transcript) setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error("SpeechRecognition error:", event);

      setIsListening(false);

      const err = event?.error || "unknown";

      if (err === "not-allowed" || err === "service-not-allowed") {
        addBotMessage("Mic permission denied. Chrome → Site settings → Microphone → Allow, then refresh.");
        return;
      }
      if (err === "no-speech") {
        addBotMessage("No speech detected. Please speak closer to the mic.");
        return;
      }
      if (err === "audio-capture") {
        addBotMessage("No microphone found. Please connect a mic or allow mic access.");
        return;
      }
      if (err === "network") {
        addBotMessage("Network issue in speech service. Try again on stable internet.");
        return;
      }

      addBotMessage("Voice error: " + err);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (e) {
      console.error("Recognition start failed:", e);
      setIsListening(false);
      addBotMessage("Could not start voice input. Try refreshing the page.");
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch (e) {
      console.warn("Stop listening failed:", e);
    }
    setIsListening(false);
  };

  // Stop recognition on unmount
  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
    };
  }, []);

  const quickQueries = ["Punjab mandi", "Rajasthan mandi", "Gujarat mandi", "weather"];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
        />
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-[110px] right-5 sm:bottom-6 sm:right-6
                     w-14 h-14 bg-brand-green text-white rounded-full shadow-xl
                     flex items-center justify-center active:scale-95 transition z-50"
          type="button"
        >
          <MessageSquare />
        </button>
      )}

      {/* Chat Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px]
        bg-white dark:bg-neutral-900 shadow-2xl z-50
        transition-transform duration-200
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="bg-brand-green text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <MessageSquare />
            <h3 className="font-semibold">Agri Assistant</h3>
          </div>
          <button onClick={() => setIsOpen(false)} type="button">
            <X />
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3"
          style={{ height: "calc(100% - 210px)" }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm break-words whitespace-pre-wrap
                ${
                  msg.sender === "user"
                    ? "bg-brand-green text-white"
                    : "bg-gray-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Typing...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Buttons */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto">
          {quickQueries.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 text-xs rounded-full whitespace-nowrap"
              type="button"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Section */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 pb-6">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-12 h-12 rounded-full flex items-center justify-center
            ${
              isListening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-neutral-200 dark:bg-neutral-800"
            }`}
            type="button"
            title={isListening ? "Stop" : "Speak"}
          >
            <Mic size={18} />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Speak or type your message..."
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-neutral-800 rounded-full outline-none text-sm dark:text-white"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="bg-brand-green text-white px-4 py-3 rounded-full disabled:opacity-50"
            type="button"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
}