import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import PropTypes from "prop-types";

export default function VoiceButton({ onTranscript, onError, className = "" }) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const isSupported =
    "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

  const getLangCode = () => {
    const lang = localStorage.getItem("language") || "en";
    const map = {
      en: "en-IN",
      hi: "hi-IN",
      gu: "gu-IN",
    };
    return map[lang] || "en-IN";
  };

  const start = () => {
    if (!isSupported) {
      onError?.("Voice recognition not supported in this browser (use Chrome).");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = getLangCode();
    recognition.interimResults = true; // show partial text
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onTranscript?.(transcript);
    };

    recognition.onerror = (e) => {
      console.error("SpeechRecognition error:", e);
      onError?.(e.error || "Speech recognition error");
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={isListening ? stop : start}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition
        ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-neutral-200 dark:bg-neutral-800"}
        ${className}`}
      aria-label={isListening ? "Stop listening" : "Start voice input"}
    >
      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
    </button>
  );
}

VoiceButton.propTypes = {
  onTranscript: PropTypes.func,
  onError: PropTypes.func,
  className: PropTypes.string,
};