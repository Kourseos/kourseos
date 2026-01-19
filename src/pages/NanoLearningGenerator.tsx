import { useState } from 'react';
import { LessonCard } from '../components/LessonCard';
import { LoadingState } from '../components/LoadingState';
import { motion } from 'framer-motion';
import { Sparkles, Plus, BookOpen, ChevronLeft } from 'lucide-react';
import { generateNanoLessons, type NanoLessonAtom } from '../lib/groq';
import { createCourse, saveLessonsToDatabase } from '../lib/database';

interface GeneratedCourse {
    id: string;
    title: string;
    lessons: NanoLessonAtom[];
}

const NanoLearningGenerator = () => {
    const [topic, setTopic] = useState('');
    const [numLessons, setNumLessons] = useState(5);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedCourse, setGeneratedCourse] = useState<GeneratedCourse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Por favor ingresa un tema para el curso');
            return;
        }

        setIsGenerating(true);
        setError(null);
        setGeneratedCourse(null);

        try {
            // Paso 1: Generar lecciones con IA
            const lessons = await generateNanoLessons(topic, numLessons);

            // Paso 2: Crear el curso en Supabase
            // NOTA: Aquí usamos un ID de usuario hardcoded para desarrollo
            // En producción, esto vendría del contexto de autenticación
            const creatorId = 'demo-creator-id';
            const course = await createCourse(
                creatorId,
                topic,
                `Curso de Nano Learning sobre ${topic} generado con IA`
            );

            // Paso 3: Guardar las lecciones en la base de datos
            await saveLessonsToDatabase(course.id, lessons);

            // Paso 4: Mostrar el resultado
            setGeneratedCourse({
                id: course.id,
                title: topic,
                lessons,
            });

        } catch (err: any) {
            console.error('Error generando curso:', err);
            setError(err.message || 'Ocurrió un error al generar el curso. Verifica tu configuración de API.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleReset = () => {
        setGeneratedCourse(null);
        setTopic('');
        setNumLessons(5);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-white/5 bg-gradient-to-br from-primary/5 to-background px-10 py-12"
            >
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                            <Sparkles className="text-primary" size={24} />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-text">
                            Generador de Nano Learning
                        </h1>
                    </div>
                    <p className="text-base text-text-muted max-w-2xl leading-relaxed">
                        Convierte cualquier tema en átomos de conocimiento consumibles en 60-90 segundos.
                        Cada lección incluye audio gratuito con Web Speech API.
                    </p>
                </div>
            </motion.header>

            <main className="p-10 max-w-5xl mx-auto">
                {!generatedCourse ? (
                    /* Generator Form */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="surface-card">
                            <h2 className="text-xl font-semibold text-text mb-6 flex items-center gap-2">
                                <BookOpen size={20} className="text-primary" />
                                Configuración del Curso
                            </h2>

                            <div className="space-y-6">
                                {/* Topic Input */}
                                <div>
                                    <label htmlFor="topic" className="block text-sm font-medium text-text mb-2">
                                        Tema del Curso
                                    </label>
                                    <input
                                        id="topic"
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="Ej: Marketing Digital para Creadores de Contenido"
                                        className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                        disabled={isGenerating}
                                    />
                                </div>

                                {/* Number of Lessons */}
                                <div>
                                    <label htmlFor="numLessons" className="block text-sm font-medium text-text mb-2">
                                        Número de Lecciones
                                    </label>
                                    <select
                                        id="numLessons"
                                        value={numLessons}
                                        onChange={(e) => setNumLessons(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-text focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                        disabled={isGenerating}
                                    >
                                        <option value={3}>3 lecciones</option>
                                        <option value={5}>5 lecciones</option>
                                        <option value={7}>7 lecciones</option>
                                        <option value={10}>10 lecciones</option>
                                    </select>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                                    >
                                        <p className="text-sm text-red-400">{error}</p>
                                    </motion.div>
                                )}

                                {/* Generate Button */}
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !topic.trim()}
                                    className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Generando...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={20} />
                                            Generar Curso con IA
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Info Card */}
                        {!isGenerating && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="surface-card bg-gradient-to-br from-primary/10 to-transparent border-primary/30"
                            >
                                <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">
                                    ✨ Características del Nano Learning
                                </h3>
                                <ul className="space-y-2 text-sm text-text/80">
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary">•</span>
                                        <span>Cada lección se consume en <strong className="text-primary">60-90 segundos</strong></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary">•</span>
                                        <span>Contenido en <strong className="text-primary">Markdown</strong> con formato profesional</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary">•</span>
                                        <span><strong className="text-primary">Audio gratuito</strong> con Web Speech API (estrategia de marketing)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary">•</span>
                                        <span>Acción concreta al final de cada lección</span>
                                    </li>
                                </ul>
                            </motion.div>
                        )}
                    </motion.div>
                ) : null}

                {/* Loading State */}
                {isGenerating && (
                    <LoadingState
                        message="Sintetizando lecciones inteligentes..."
                        count={numLessons}
                    />
                )}

                {/* Generated Course Display */}
                {generatedCourse && !isGenerating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        {/* Success Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleReset}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-text-muted hover:text-text rounded-xl transition-all border border-white/10"
                                >
                                    <ChevronLeft size={16} />
                                    Nuevo Curso
                                </button>
                                <div>
                                    <h2 className="text-2xl font-bold text-text">{generatedCourse.title}</h2>
                                    <p className="text-sm text-text-muted">
                                        {generatedCourse.lessons.length} lecciones • Guardado en Supabase
                                    </p>
                                </div>
                            </div>
                            <div className="badge-founder flex items-center gap-2">
                                <Sparkles size={12} />
                                Generado con IA
                            </div>
                        </div>

                        {/* Lessons Grid */}
                        <div className="space-y-6">
                            {generatedCourse.lessons.map((lesson, index) => (
                                <LessonCard
                                    key={index}
                                    title={lesson.title}
                                    concept={lesson.concept}
                                    explanation={lesson.explanation}
                                    action={lesson.action}
                                    position={index + 1}
                                />
                            ))}
                        </div>

                        {/* Footer CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="surface-card text-center bg-gradient-to-br from-accent/10 to-transparent border-accent/30"
                        >
                            <p className="text-text/80 mb-4">
                                ✅ Tu curso ha sido guardado exitosamente en la base de datos
                            </p>
                            <button
                                onClick={handleReset}
                                className="btn-primary"
                            >
                                Crear Otro Curso
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default NanoLearningGenerator;
