import { useState, useEffect, useRef } from "react";
import { MessageSquare, Mic, X, Send } from "lucide-react";
import * as API from "../../services/api";
import { translateText } from "../../services/translateService";

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // ✅ Initial Greeting (Google Translate will auto-translate UI)
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: "Namaste! I am your Agri Assistant. Ask about mandi prices or weather.",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const addBotMessage = async (text) => {
    // If you later want manual API translation,
    // you can uncomment below line and control language from localStorage
    /*
    const selectedLang = localStorage.getItem("selectedLanguage") || "en";
    if (selectedLang !== "en") {
      text = await translateText(text, selectedLang);
    }
    */

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        text,
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        text,
        sender: "user",
        timestamp: new Date(),
      },
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
          await addBotMessage("Geolocation is not supported in this browser.");
          setIsLoading(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const lat = pos.coords.latitude;
              const lon = pos.coords.longitude;

              const response = await API.chatWithWeather(lat, lon);

              await addBotMessage(
                response?.text || "Weather data unavailable."
              );
            } catch (err) {
              console.error(err);
              await addBotMessage("Weather fetch failed.");
            } finally {
              setIsLoading(false);
            }
          },
          async () => {
            await addBotMessage(
              "Location permission denied. Please allow location access."
            );
            setIsLoading(false);
          }
        );

        return;
      }

      // 💬 NORMAL CHAT FLOW
      const response = await API.chatWithBot(text);

      await addBotMessage(response?.text || "No response received.");
    } catch (error) {
      console.error("Chat error:", error);
      await addBotMessage("Something went wrong. Please try again.");
    } finally {
      if (!isWeatherQuery(text)) setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) =>
        audioChunksRef.current.push(e.data);

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        setIsLoading(true);

        try {
          const response = await API.chatWithBotAudio(audioBlob);
          await addBotMessage(
            response?.text || "Voice response unavailable."
          );
        } catch (err) {
          console.error(err);
          await addBotMessage("Voice request failed.");
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      await addBotMessage("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const quickQueries = [
    "Punjab mandi",
    "Rajasthan mandi",
    "Gujarat mandi",
    "weather",
  ];

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
          <button onClick={() => setIsOpen(false)}>
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
              className={`flex ${
                msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
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
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Section */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 pb-6">
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`w-12 h-12 rounded-full flex items-center justify-center
            ${
              isRecording
                ? "bg-red-500 text-white"
                : "bg-neutral-200 dark:bg-neutral-800"
            }`}
          >
            <Mic size={18} />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleSend()
            }
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-neutral-800 rounded-full outline-none text-sm dark:text-white"
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