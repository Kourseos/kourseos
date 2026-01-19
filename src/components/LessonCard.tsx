import React from 'react';
import Markdown from 'markdown-to-jsx';
import { Play, Pause, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface LessonCardProps {
    title: string;
    concept: string;
    explanation: string;
    action: string;
    position: number;
}

export const LessonCard: React.FC<LessonCardProps> = ({
    title,
    concept,
    explanation,
    action,
    position,
}) => {
    const { isPlaying, isPaused, toggle, isSupported } = useSpeechSynthesis(
        `${concept}. ${explanation}. ${action}`
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: position * 0.1 }}
            className="surface-card group relative overflow-hidden"
        >
            {/* Gradient Background Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold border border-primary/20">
                        Lección {position}
                    </div>
                    <h3 className="text-lg font-semibold text-text">{title}</h3>
                </div>

                {/* Audio Control Button */}
                {isSupported && (
                    <button
                        onClick={toggle}
                        className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all duration-200 border border-primary/20 hover:border-primary/30"
                        aria-label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
                    >
                        {isPlaying ? (
                            <>
                                <Pause size={16} className="animate-pulse" />
                                <span className="text-xs font-medium">Pausar</span>
                            </>
                        ) : isPaused ? (
                            <>
                                <Play size={16} />
                                <span className="text-xs font-medium">Continuar</span>
                            </>
                        ) : (
                            <>
                                <Volume2 size={16} />
                                <span className="text-xs font-medium">Escuchar</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Key Concept */}
            <div className="mb-4 p-3 bg-accent/10 border border-accent/20 rounded-xl">
                <p className="text-xs uppercase tracking-wider text-accent font-bold mb-1">
                    Concepto Clave
                </p>
                <p className="text-sm font-semibold text-text">{concept}</p>
            </div>

            {/* Explanation with Markdown */}
            <div className="mb-4 prose prose-invert prose-sm max-w-none">
                <Markdown
                    options={{
                        overrides: {
                            h1: { component: 'h4', props: { className: 'text-text font-bold text-base mb-2' } },
                            h2: { component: 'h5', props: { className: 'text-text font-semibold text-sm mb-2' } },
                            p: { component: 'p', props: { className: 'text-text/80 text-sm leading-relaxed mb-3' } },
                            strong: { component: 'strong', props: { className: 'text-primary font-semibold' } },
                            ul: { component: 'ul', props: { className: 'list-disc list-inside space-y-1 text-text/80 text-sm' } },
                            ol: { component: 'ol', props: { className: 'list-decimal list-inside space-y-1 text-text/80 text-sm' } },
                            code: { component: 'code', props: { className: 'px-2 py-0.5 bg-background rounded text-primary text-xs font-mono' } },
                            pre: { component: 'pre', props: { className: 'bg-background p-3 rounded-lg overflow-x-auto border border-white/5' } },
                        },
                    }}
                >
                    {explanation}
                </Markdown>
            </div>

            {/* Action Item */}
            <div className="pt-4 border-t border-white/5">
                <p className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-2">
                    ⚡ Acción Inmediata
                </p>
                <p className="text-sm text-text/90 font-medium">{action}</p>
            </div>

            {/* Playing Indicator */}
            {isPlaying && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary/30"
                >
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 90, ease: 'linear' }} // Estimación de 90 segundos
                    />
                </motion.div>
            )}
        </motion.div>
    );
};
