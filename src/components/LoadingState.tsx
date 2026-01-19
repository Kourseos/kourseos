import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonLessonCard: React.FC = () => {
    return (
        <div className="surface-card animate-pulse">
            {/* Header Skeleton */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-20 h-6 bg-primary/10 rounded-lg" />
                    <div className="w-48 h-6 bg-white/5 rounded-lg" />
                </div>
                <div className="w-24 h-8 bg-primary/10 rounded-lg" />
            </div>

            {/* Key Concept Skeleton */}
            <div className="mb-4 p-3 bg-accent/10 border border-accent/20 rounded-xl">
                <div className="w-24 h-3 bg-accent/20 rounded mb-2" />
                <div className="w-full h-4 bg-white/5 rounded" />
            </div>

            {/* Explanation Skeleton */}
            <div className="mb-4 space-y-2">
                <div className="w-full h-3 bg-white/5 rounded" />
                <div className="w-5/6 h-3 bg-white/5 rounded" />
                <div className="w-4/6 h-3 bg-white/5 rounded" />
                <div className="w-full h-3 bg-white/5 rounded" />
                <div className="w-3/4 h-3 bg-white/5 rounded" />
            </div>

            {/* Action Item Skeleton */}
            <div className="pt-4 border-t border-white/5">
                <div className="w-32 h-3 bg-emerald-400/20 rounded mb-2" />
                <div className="w-full h-4 bg-white/5 rounded" />
            </div>
        </div>
    );
};

interface LoadingStateProps {
    message?: string;
    count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
    message = 'Sintetizando lecciones inteligentes...',
    count = 3
}) => {
    return (
        <div className="space-y-8">
            {/* Loading Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-2xl border border-primary/20">
                    <div className="flex gap-1">
                        <motion.div
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                    </div>
                    <span className="text-primary font-semibold text-sm">{message}</span>
                </div>
            </motion.div>

            {/* Skeleton Cards */}
            <div className="space-y-6">
                {Array.from({ length: count }).map((_, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 }}
                    >
                        <SkeletonLessonCard />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
