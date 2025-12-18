import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const VoiceCommandContext = createContext();

export const useVoiceCommand = () => useContext(VoiceCommandContext);

export const VoiceCommandProvider = ({ children }) => {
    const [isListening, setIsListening] = useState(false);
    const [isContinuousMode, setIsContinuousMode] = useState(false);
    const [lastCommand, setLastCommand] = useState('');
    const [commandConfidence, setCommandConfidence] = useState(0);
    const [recognizedText, setRecognizedText] = useState('');
    const [commandHistory, setCommandHistory] = useState([]);
    const [wakeWord, setWakeWord] = useState('hey assistant');
    const [isWakeWordActive, setIsWakeWordActive] = useState(false);

    const recognitionRef = useRef(null);
    const commandHandlersRef = useRef({});
    const restartTimeoutRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech Recognition not supported in this browser');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 3;

        recognition.onstart = () => {
            console.log('Voice recognition started');
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const results = event.results;
            const lastResult = results[results.length - 1];
            const transcript = lastResult[0].transcript.toLowerCase().trim();
            const confidence = lastResult[0].confidence;

            setRecognizedText(transcript);
            setCommandConfidence(confidence);

            // Only process final results
            if (lastResult.isFinal) {
                console.log('Recognized:', transcript, 'Confidence:', confidence);

                // Check for wake word if in continuous mode
                if (isContinuousMode && !isWakeWordActive) {
                    if (transcript.includes(wakeWord)) {
                        setIsWakeWordActive(true);
                        setRecognizedText('Listening for command...');
                        speakFeedback('Yes?');
                        return;
                    }
                } else {
                    // Process command
                    processCommand(transcript, confidence);

                    // Reset wake word state after command
                    if (isContinuousMode) {
                        setTimeout(() => setIsWakeWordActive(false), 3000);
                    }
                }
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'no-speech') {
                // Restart if in continuous mode
                if (isContinuousMode) {
                    restartRecognition();
                }
            }
        };

        recognition.onend = () => {
            console.log('Voice recognition ended');
            setIsListening(false);

            // Auto-restart in continuous mode
            if (isContinuousMode) {
                restartRecognition();
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (restartTimeoutRef.current) {
                clearTimeout(restartTimeoutRef.current);
            }
        };
    }, [isContinuousMode, isWakeWordActive, wakeWord]);

    const restartRecognition = () => {
        if (restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current);
        }
        restartTimeoutRef.current = setTimeout(() => {
            if (recognitionRef.current && isContinuousMode) {
                try {
                    recognitionRef.current.start();
                } catch (e) {
                    console.log('Recognition already started');
                }
            }
        }, 1000);
    };

    const speakFeedback = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    const processCommand = (transcript, confidence) => {
        setLastCommand(transcript);

        // Add to history
        setCommandHistory(prev => [...prev.slice(-9), {
            text: transcript,
            confidence,
            timestamp: Date.now()
        }]);

        // Parse and execute command
        const command = parseCommand(transcript);
        console.log('Parsed command:', command, 'from transcript:', transcript);

        if (command) {
            executeCommand(command);
        } else {
            console.warn('No command matched for:', transcript);
            speakFeedback('Sorry, I didn\'t understand that command');
        }
    };

    const parseCommand = (transcript) => {
        const text = transcript.toLowerCase();

        // Upload commands
        if (text.includes('upload') || text.includes('select file') || text.includes('choose file')) {
            return { action: 'upload', params: {} };
        }

        // Settings commands
        if (text.includes('settings') || text.includes('open settings')) {
            return { action: 'openSettings', params: {} };
        }
        if (text.includes('close settings') || text.includes('go back')) {
            return { action: 'closeSettings', params: {} };
        }

        // Speed control
        if (text.includes('increase speed') || text.includes('faster')) {
            return { action: 'increaseSpeed', params: {} };
        }
        if (text.includes('decrease speed') || text.includes('slower')) {
            return { action: 'decreaseSpeed', params: {} };
        }

        // Auto-narrate
        if (text.includes('enable') && text.includes('narrate')) {
            return { action: 'enableNarrate', params: {} };
        }
        if (text.includes('disable') && text.includes('narrate')) {
            return { action: 'disableNarrate', params: {} };
        }

        // Text size control - more flexible matching
        if (
            text.includes('increase text') ||
            text.includes('bigger text') ||
            text.includes('larger text') ||
            text.includes('make text bigger') ||
            text.includes('make text larger') ||
            text.includes('text bigger') ||
            text.includes('text larger') ||
            (text.includes('increase') && text.includes('size')) ||
            (text.includes('bigger') && text.includes('size')) ||
            text.includes('zoom in')
        ) {
            return { action: 'increaseTextSize', params: {} };
        }

        if (
            text.includes('decrease text') ||
            text.includes('smaller text') ||
            text.includes('make text smaller') ||
            text.includes('text smaller') ||
            (text.includes('decrease') && text.includes('size')) ||
            (text.includes('smaller') && text.includes('size')) ||
            text.includes('zoom out')
        ) {
            return { action: 'decreaseTextSize', params: {} };
        }

        // Analysis commands
        if (text.includes('analyze') || text.includes('start analysis')) {
            return { action: 'analyze', params: {} };
        }

        // Chat commands - extract the actual question
        if (text.includes('ask about')) {
            const query = text.replace('ask about', '').trim();
            return { action: 'ask', params: { query } };
        }
        if (text.includes('what is') || text.includes('what are')) {
            const query = text; // Keep the full question
            return { action: 'ask', params: { query } };
        }
        if (text.includes('tell me about')) {
            const query = text.replace('tell me about', '').trim();
            return { action: 'ask', params: { query } };
        }
        if (text.includes('explain')) {
            const query = text; // Keep the full question
            return { action: 'ask', params: { query } };
        }
        if (text.startsWith('why') || text.startsWith('how') || text.startsWith('when') || text.startsWith('where')) {
            const query = text; // Keep the full question
            return { action: 'ask', params: { query } };
        }

        // Help
        if (text.includes('help') || text.includes('what can you do')) {
            return { action: 'help', params: {} };
        }

        // Stop/Cancel
        if (text === 'stop' || text === 'cancel') {
            return { action: 'stop', params: {} };
        }

        // Repeat
        if (text === 'repeat' || text.includes('say that again')) {
            return { action: 'repeat', params: {} };
        }

        return null;
    };

    const executeCommand = (command) => {
        console.log('Executing command:', command);

        const handler = commandHandlersRef.current[command.action];
        if (handler) {
            handler(command.params);
            speakFeedback('Done');
        } else {
            console.warn('No handler for command:', command.action);
        }
    };

    const registerCommandHandler = useCallback((action, handler) => {
        commandHandlersRef.current[action] = handler;
    }, []);

    const unregisterCommandHandler = useCallback((action) => {
        delete commandHandlersRef.current[action];
    }, []);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
                setRecognizedText('Listening...');
            } catch (e) {
                console.error('Error starting recognition:', e);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setRecognizedText('');
            setIsWakeWordActive(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const toggleContinuousMode = () => {
        const newMode = !isContinuousMode;
        setIsContinuousMode(newMode);

        if (newMode) {
            startListening();
            speakFeedback('Continuous listening enabled. Say ' + wakeWord + ' to give commands');
        } else {
            stopListening();
            speakFeedback('Continuous listening disabled');
        }
    };

    const getAvailableCommands = () => {
        return [
            { command: 'upload', description: 'Open file picker' },
            { command: 'open settings', description: 'Open settings panel' },
            { command: 'close settings', description: 'Close settings panel' },
            { command: 'increase speed', description: 'Increase speech speed' },
            { command: 'decrease speed', description: 'Decrease speech speed' },
            { command: 'increase text size', description: 'Make text bigger' },
            { command: 'decrease text size', description: 'Make text smaller' },
            { command: 'analyze', description: 'Start report analysis' },
            { command: 'ask about [topic]', description: 'Ask a question about your report' },
            { command: 'what is [term]', description: 'Get explanation of medical term' },
            { command: 'explain [topic]', description: 'Get detailed explanation' },
            { command: 'help', description: 'Show available commands' },
            { command: 'stop', description: 'Stop current action' },
        ];
    };

    return (
        <VoiceCommandContext.Provider value={{
            isListening,
            isContinuousMode,
            lastCommand,
            commandConfidence,
            recognizedText,
            commandHistory,
            wakeWord,
            isWakeWordActive,
            startListening,
            stopListening,
            toggleListening,
            toggleContinuousMode,
            registerCommandHandler,
            unregisterCommandHandler,
            getAvailableCommands,
            setWakeWord
        }}>
            {children}
        </VoiceCommandContext.Provider>
    );
};
