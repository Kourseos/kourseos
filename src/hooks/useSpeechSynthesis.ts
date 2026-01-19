import { useState, useEffect, useRef } from 'react';

export interface SpeechState {
    isPlaying: boolean;
    isPaused: boolean;
    isSupported: boolean;
}

export function useSpeechSynthesis(text: string) {
    const [state, setState] = useState<SpeechState>({
        isPlaying: false,
        isPaused: false,
        isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
    });

    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        if (!state.isSupported) return;

        // Limpiar al desmontar
        return () => {
            if (utteranceRef.current) {
                window.speechSynthesis.cancel();
            }
        };
    }, [state.isSupported]);

    const speak = () => {
        if (!state.isSupported) {
            console.warn('Web Speech API no está soportada en este navegador');
            return;
        }

        // Si ya está pausado, solo reanudar
        if (state.isPaused) {
            window.speechSynthesis.resume();
            setState(prev => ({ ...prev, isPaused: false, isPlaying: true }));
            return;
        }

        // Cancelar cualquier reproducción anterior
        window.speechSynthesis.cancel();

        // Limpiar el texto de Markdown para el TTS
        const cleanText = text
            .replace(/[*_~`#]/g, '') // Eliminar caracteres de Markdown
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convertir links a solo texto
            .replace(/```[\s\S]*?```/g, '') // Eliminar bloques de código
            .replace(/\n+/g, '. '); // Convertir saltos de línea en pausas

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'es-ES';
        utterance.rate = 0.9; // Velocidad ligeramente más lenta para mejor comprensión
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => {
            setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
        };

        utterance.onend = () => {
            setState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
        };

        utterance.onerror = (error) => {
            console.error('Error en Web Speech API:', error);
            setState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const pause = () => {
        if (!state.isSupported || !state.isPlaying) return;

        window.speechSynthesis.pause();
        setState(prev => ({ ...prev, isPaused: true, isPlaying: false }));
    };

    const stop = () => {
        if (!state.isSupported) return;

        window.speechSynthesis.cancel();
        setState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
    };

    const toggle = () => {
        if (state.isPlaying) {
            pause();
        } else {
            speak();
        }
    };

    return {
        ...state,
        speak,
        pause,
        stop,
        toggle,
    };
}
