import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Mic, X, Send, Volume2, Pause } from 'lucide-react';
import { chatWithBot, chatWithBotAudio } from '../../services/api';

export default function VoiceAssistant() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: t('assistantGreeting') || 'नमस्ते! मैं आपका कृषि सहायक हूँ। मैं आपकी कैसे मदद कर सकता हूँ?',
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [playingAudioId, setPlayingAudioId] = useState(null);

    const messagesEndRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioRef = useRef(new Audio());

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: text,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chatWithBot(text);
            const botMessage = {
                id: Date.now() + 1,
                text: response.text,
                sender: 'bot',
                audioUrl: response.voice ? `http://localhost:5001${response.voice}` : null,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);

            if (botMessage.audioUrl) {
                playAudio(botMessage.audioUrl, botMessage.id);
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                text: t('chatError') || 'माफ़ करें, अभी मैं जवाब नहीं दे पा रहा हूँ। कृपया इंटरनेट कनेक्शन जाँचें।',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await handleVoiceUpload(audioBlob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert(t('micError') || 'माइक्रोफ़ोन एक्सेस करने में विफल।');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleVoiceUpload = async (audioBlob) => {
        setIsLoading(true);
        try {
            const response = await chatWithBotAudio(audioBlob);
            const botMessage = {
                id: Date.now(),
                text: response.text,
                sender: 'bot',
                audioUrl: response.voice ? `http://localhost:5001${response.voice}` : null,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);

            if (botMessage.audioUrl) {
                playAudio(botMessage.audioUrl, botMessage.id);
            }
        } catch (error) {
            console.error('Voice chat error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const playAudio = (url, id) => {
        if (playingAudioId === id) {
            audioRef.current.pause();
            setPlayingAudioId(null);
        } else {
            audioRef.current.src = url;
            audioRef.current.play();
            setPlayingAudioId(id);
            audioRef.current.onended = () => setPlayingAudioId(null);
        }
    };

    const quickQueries = [
        t('queryWheat') || 'आज गेहूं का भाव क्या है?',
        t('queryWeather') || 'मौसम कैसा है?',
        t('queryScheme') || 'पीएम किसान योजना',
        t('queryInsurance') || 'फसल बीमा',
    ];

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-20 h-20 bg-brand-green text-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(44,95,45,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group overflow-hidden border-4 border-white dark:border-neutral-800"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-green to-brand-brown opacity-0 group-hover:opacity-20 transition-opacity" />
                    <Mic className="w-10 h-10 relative z-10" />
                </button>
            )}

            {/* Chat Interface Overlay */}
            <div
                className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white dark:bg-[#0F110C] shadow-[-20px_0_100px_rgba(0,0,0,0.2)] z-[60] transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col border-l border-white/10`}
            >
                {/* Header */}
                <div className="bg-brand-green dark:bg-neutral-800 p-8 text-white flex items-center justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 -translate-y-10 blur-2xl" />
                    <div className="relative z-10 flex items-center gap-5">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                            <MessageSquare className="w-9 h-9" />
                        </div>
                        <div>
                            <h3 className="font-black text-2xl tracking-tighter uppercase font-display">{t('assistant')}</h3>
                            <p className="text-[10px] uppercase font-black tracking-[0.2em] flex items-center gap-2 mt-1 px-2 py-0.5 bg-white/10 rounded-full w-fit">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_#4ade80]" />
                                {t('onlineStatus') || 'LIVE | KRISHI SEVAK'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-3 hover:bg-white/10 rounded-2xl transition-all"
                    >
                        <X className="w-8 h-8" />
                    </button>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-brand-cream/5 dark:bg-neutral-900/50 custom-scrollbar">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] p-5 rounded-[2rem] shadow-xl ${msg.sender === 'user'
                                    ? 'bg-brand-green text-white rounded-tr-none'
                                    : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-tl-none border border-neutral-100 dark:border-neutral-700'
                                    }`}
                            >
                                <p className="text-base font-medium leading-relaxed">{msg.text}</p>
                                <div className={`mt-3 flex items-center justify-between gap-6 ${msg.sender === 'user' ? 'text-white/60' : 'text-neutral-500'}`}>
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {msg.audioUrl && (
                                        <button
                                            onClick={() => playAudio(msg.audioUrl, msg.id)}
                                            className={`p-2 rounded-full transition-all ${msg.sender === 'user' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-brand-green/10 hover:bg-brand-green text-brand-green hover:text-white'}`}
                                        >
                                            {playingAudioId === msg.id ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-neutral-800 p-6 rounded-[2rem] rounded-tl-none border border-neutral-100 dark:border-neutral-700 shadow-xl">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-brand-green rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-brand-green rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-2 h-2 bg-brand-green rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Queries */}
                <div className="px-6 py-4 bg-white/50 dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        {quickQueries.map((query) => (
                            <button
                                key={query}
                                onClick={() => handleSend(query)}
                                className="px-5 py-2.5 bg-white dark:bg-neutral-800 border-2 border-neutral-100 dark:border-neutral-700 rounded-2xl text-xs font-black text-neutral-600 dark:text-neutral-400 hover:border-brand-green hover:text-brand-green transition-all shadow-sm flex-shrink-0 uppercase tracking-tighter"
                            >
                                {query}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Input Area */}
                <div className="p-8 bg-white dark:bg-neutral-900 border-t-2 border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-4">
                        <button
                            onMouseDown={startRecording}
                            onMouseUp={stopRecording}
                            onTouchStart={startRecording}
                            onTouchEnd={stopRecording}
                            className={`w-16 h-16 rounded-3xl transition-all flex-shrink-0 flex items-center justify-center ${isRecording
                                ? 'bg-red-500 text-white animate-pulse shadow-2xl scale-110'
                                : 'bg-brand-cream dark:bg-neutral-800 text-brand-green hover:bg-brand-green hover:text-white'
                                }`}
                        >
                            <Mic className="w-7 h-7" />
                        </button>
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={t('typeHere') || "यहाँ टाइप करें..."}
                                className="w-full pl-6 pr-14 py-5 bg-neutral-100 dark:bg-neutral-800 border-none rounded-3xl focus:ring-4 focus:ring-brand-green/10 transition-all text-base font-bold dark:text-white"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim()}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 text-brand-green hover:bg-brand-green hover:text-white rounded-2xl disabled:text-neutral-300 disabled:hover:bg-transparent transition-all"
                            >
                                <Send className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center text-neutral-400 mt-6">
                        {isRecording ? t('processingVoice') : t('holdToRecord') || 'सहायता के लिए बटन दबाकर बोलें'}
                    </p>
                </div>
            </div>
        </>
    );
}
