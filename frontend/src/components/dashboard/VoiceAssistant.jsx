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

  // Initial Greeting
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: "Namaste! I am your Agri Assistant. Ask about mandi prices or weather.",
        sender: "bot",
      },
    ]);
  }, []);

  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);

    const langMap = {
      en: "en-IN",
      hi: "hi-IN",
      gu: "gu-IN",
    };

    const selectedLang = localStorage.getItem("language") || "en";
    utterance.lang = langMap[selectedLang] || "en-IN";

    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const addBotMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text, sender: "bot" },
    ]);

    // 🔊 Speak AI response
    speakText(text);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, text, sender: "user" },
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
      // WEATHER FLOW
      if (isWeatherQuery(text)) {
        if (!navigator.geolocation) {
          addBotMessage("Geolocation is not supported.");
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
              addBotMessage(response?.text || "Weather unavailable.");
            } catch {
              addBotMessage("Weather fetch failed.");
            } finally {
              setIsLoading(false);
            }
          },
          () => {
            addBotMessage("Location permission denied.");
            setIsLoading(false);
          }
        );

        return;
      }

      // NORMAL CHAT
      const response = await API.chatWithBot(text);
      addBotMessage(response?.text || "No response received.");
    } catch {
      addBotMessage("Something went wrong.");
    } finally {
      if (!isWeatherQuery(text)) setIsLoading(false);
    }
  };

  // 🎤 SPEECH TO TEXT
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      addBotMessage("Voice not supported. Use Chrome.");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    const langMap = {
      en: "en-IN",
      hi: "hi-IN",
      gu: "gu-IN",
    };

    const selectedLang = localStorage.getItem("language") || "en";
    recognition.lang = langMap[selectedLang] || "en-IN";

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      addBotMessage("Voice recognition failed.");
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const quickQueries = [
    "Punjab mandi",
    "Rajasthan mandi",
    "Gujarat mandi",
    "weather",
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
        />
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-[110px] right-5 w-14 h-14 bg-brand-green text-white rounded-full shadow-xl flex items-center justify-center z-50"
        >
          <MessageSquare />
        </button>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px]
        bg-white dark:bg-neutral-900 shadow-2xl z-50
        transition-transform duration-200
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="bg-brand-green text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <MessageSquare />
            <h3 className="font-semibold">Agri Assistant</h3>
          </div>
          <button onClick={() => setIsOpen(false)}>
            <X />
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto p-4 space-y-3"
          style={{ height: "calc(100% - 210px)" }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm break-words
                ${
                  msg.sender === "user"
                    ? "bg-brand-green text-white"
                    : "bg-gray-100 dark:bg-neutral-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && <div className="text-xs">Typing...</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-4 py-2 flex gap-2 overflow-x-auto">
          {quickQueries.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 text-xs rounded-full"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="p-4 border-t flex items-center gap-2 pb-6">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-12 h-12 rounded-full flex items-center justify-center
            ${
              isListening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-neutral-200 dark:bg-neutral-800"
            }`}
          >
            <Mic size={18} />
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Speak or type your message..."
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-neutral-800 rounded-full outline-none text-sm"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="bg-brand-green text-white px-4 py-3 rounded-full disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
}