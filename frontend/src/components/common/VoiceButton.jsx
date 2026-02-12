import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import PropTypes from 'prop-types';

export default function VoiceButton({
    onTranscript,
    onError,
    className = ''
}) {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        // Check if browser supports Web Speech API
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setIsSupported(false);
        }
    }, []);

    const toggleListening = () => {
        if (!isSupported) {
            onError?.('Voice recognition is not supported in this browser');
            return;
        }

        if (isListening) {
            setIsListening(false);
            // Stop recognition logic will be added when integrating with voice service
        } else {
            setIsListening(true);
            // Start recognition logic will be added when integrating with voice service
            // For now, simulate a transcript after 2 seconds
            setTimeout(() => {
                onTranscript?.('आज गेहूं का भाव क्या है?');
                setIsListening(false);
            }, 2000);
        }
    };

    if (!isSupported) {
        return null;
    }

    return (
        <button
            onClick={toggleListening}
            className={`touch-target w-16 h-16 rounded-full transition-all duration-300 
        ${isListening
                    ? 'bg-error shadow-glow-orange animate-pulse-slow'
                    : 'bg-primary-500 shadow-medium hover:shadow-glow hover:scale-110'
                } 
        text-white flex items-center justify-center active:scale-95 ${className}`}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        >
            {isListening ? (
                <div className="relative">
                    <Mic className="w-7 h-7" />
                    <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                </div>
            ) : (
                <Mic className="w-7 h-7" />
            )}
        </button>
    );
}

VoiceButton.propTypes = {
    onTranscript: PropTypes.func,
    onError: PropTypes.func,
    className: PropTypes.string,
};
