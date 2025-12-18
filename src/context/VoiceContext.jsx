import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const VoiceContext = createContext();

export const useVoice = () => useContext(VoiceContext);

export const VoiceProvider = ({ children }) => {
    const [isEnabled, setIsEnabled] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speechRate, setSpeechRate] = useState(0.9); // Slower for elderly
    const [autoNarrate, setAutoNarrate] = useState(true);
    const queueRef = useRef([]);

    useEffect(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.onend = () => {
                setIsSpeaking(false);
                // Process next in queue
                if (queueRef.current.length > 0) {
                    const next = queueRef.current.shift();
                    speakNow(next);
                }
            };
        }
    }, []);

    const speakNow = (text) => {
        if (!text || !isEnabled) return;

        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[*#_]/g, '').replace(/\n/g, '. ');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = speechRate;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    const speak = (text, immediate = false) => {
        if (immediate) {
            speakNow(text);
        } else {
            queueRef.current.push(text);
            if (!isSpeaking) {
                const next = queueRef.current.shift();
                speakNow(next);
            }
        }
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        queueRef.current = [];
        setIsSpeaking(false);
    };

    const toggle = () => {
        if (isSpeaking) {
            stop();
        }
    };

    return (
        <VoiceContext.Provider value={{
            speak,
            stop,
            toggle,
            isSpeaking,
            isEnabled,
            setIsEnabled,
            speechRate,
            setSpeechRate,
            autoNarrate,
            setAutoNarrate
        }}>
            {children}
        </VoiceContext.Provider>
    );
};
