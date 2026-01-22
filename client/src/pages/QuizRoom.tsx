import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HelpCircle, ChevronRight, CheckCircle2, XCircle,
    AlertTriangle, Loader2, Award, ArrowLeft, BrainCircuit, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Question {
    question: string;
    options: string[];
}

interface QuizData {
    questions: Question[];
}

const QuizRoom = () => {
    const { courseId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<{ passed: boolean, score: number, certificateId?: string, blockchainId?: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/supabase/quizzes/${courseId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setQuiz(data);
                } else {
                    setError("No se pudo generar el examen final. Intenta más tarde.");
                }
            } catch (err) {
                setError("Error de conexión con el servidor de evaluación.");
            } finally {
                setLoading(false);
            }
        };

        if (token && courseId) fetchQuiz();
    }, [courseId, token]);

    const handleSelectOption = (optionIndex: number) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestion] = optionIndex;
        setSelectedAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < (quiz?.questions.length || 0) - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const response = await fetch(`http://localhost:3000/api/supabase/quizzes/${courseId}/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    answers: selectedAnswers,
                    questions: quiz?.questions
                })
            });

            const data = await response.json();
            if (response.ok) {
                setResult(data);
            } else {
                setError(data.message || "Error al calificar el examen.");
            }
        } catch (err) {
            setError("Error de red al enviar tus respuestas.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-6">
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="p-8 bg-purple-500/10 rounded-[3rem] border border-purple-500/20"
            >
                <BrainCircuit className="h-16 w-16 text-purple-600" />
            </motion.div>
            <div className="text-center">
                <h2 className="text-white font-black text-2xl tracking-tighter">Preparando tu Evaluación</h2>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2">La IA está analizando el curso...</p>
            </div>
        </div>
    );

    if (error && !result) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
            <XCircle className="h-20 w-20 text-red-500/20 mb-8" />
            <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">{error}</h2>
            <button
                onClick={() => navigate(-1)}
                className="px-12 py-4 bg-white text-black rounded-2xl font-black hover:scale-105 transition-transform"
            >
                Volver al Curso
            </button>
        </div>
    );

    if (result) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 overflow-hidden relative">
            {/* Background elements */}
            <div className={`absolute inset-0 opacity-20 blur-[100px] transition-colors duration-1000 ${result.passed ? 'bg-green-600' : 'bg-red-600'}`}></div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-2xl w-full bg-white/5 border border-white/10 p-12 md:p-16 rounded-[4rem] backdrop-blur-3xl text-center shadow-2xl"
            >
                {result.passed ? (
                    <>
                        <div className="relative inline-block mb-10">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="p-8 bg-green-500/20 rounded-full"
                            >
                                <Award className="h-20 w-20 text-green-400" />
                            </motion.div>
                            <Sparkles className="absolute -top-2 -right-2 text-yellow-400 h-8 w-8 animate-pulse" />
                        </div>
                        <h2 className="text-5xl font-black text-white mb-6 tracking-tighter leading-none">¡Felicidades, Graduado!</h2>
                        <p className="text-xl text-gray-400 mb-10 leading-relaxed italic">
                            Has demostrado maestría absoluta con un <span className="text-green-400 font-black px-2">{result.score}%</span> de aciertos. Tu certificado blockchain ha sido emitido.
                        </p>
                    </>
                ) : (
                    <>
                        <div className="inline-flex p-8 bg-red-500/20 rounded-full mb-10">
                            <AlertTriangle className="h-20 w-20 text-red-400" />
                        </div>
                        <h2 className="text-5xl font-black text-white mb-6 tracking-tighter">Casi lo logras...</h2>
                        <p className="text-xl text-gray-400 mb-10 leading-relaxed italic">
                            Tu puntuación fue de <span className="text-red-400 font-bold">{result.score}%</span>.
                            Necesitas al menos un <span className="text-white font-bold">80%</span> para obtener la certificación.
                        </p>
                    </>
                )}

                <div className="flex flex-col gap-4">
                    {result.passed ? (
                        <button
                            onClick={() => navigate(`/course/${courseId}/certificate`)}
                            className="w-full py-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-3xl font-black text-xl shadow-[0_20px_40px_rgba(22,163,74,0.3)] hover:scale-[1.03] transition-all flex items-center justify-center gap-4"
                        >
                            Ver mi Certificado <Award className="h-6 w-6" />
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setResult(null);
                                setCurrentQuestion(0);
                                setSelectedAnswers([]);
                            }}
                            className="w-full py-6 bg-white text-black rounded-3xl font-black text-xl hover:scale-[1.03] transition-all"
                        >
                            Intentar de nuevo
                        </button>
                    )}
                    <button
                        onClick={() => navigate(`/course/${courseId}`)}
                        className="w-full py-4 text-gray-500 font-bold hover:text-white transition-colors"
                    >
                        Volver al Panel
                    </button>
                </div>
            </motion.div>
        </div>
    );

    const question = quiz?.questions[currentQuestion];

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 font-sans">
            {/* Header */}
            <nav className="relative z-20 px-10 py-8 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-8">
                    <button onClick={() => navigate(-1)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group">
                        <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-white" />
                    </button>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 mb-1">SkillForge AI Masterclass</p>
                        <h1 className="font-black text-xl tracking-tight leading-none">Examen de Certificación</h1>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Estado</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-xs font-bold">Sesión Segura</span>
                        </div>
                    </div>
                    <div className="h-14 w-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center font-mono font-black text-purple-400 text-lg">
                        {currentQuestion + 1}/{quiz?.questions.length}
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-20 flex flex-col min-h-[calc(100vh-120px)]">
                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="space-y-16"
                        >
                            <div className="space-y-8">
                                <span className="bg-purple-600/10 text-purple-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-purple-400/20">
                                    Pregunta de Opción Múltiple
                                </span>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight text-white/90">
                                    {question?.question}
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {question?.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelectOption(idx)}
                                        className={`group relative p-8 rounded-[2.5rem] text-left transition-all duration-300 border-2 overflow-hidden ${selectedAnswers[currentQuestion] === idx
                                                ? 'bg-purple-600 border-purple-400 shadow-[0_20px_40px_rgba(147,51,234,0.3)]'
                                                : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/[0.07]'
                                            }`}
                                    >
                                        <div className="flex items-center gap-6 relative z-10">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-colors ${selectedAnswers[currentQuestion] === idx ? 'bg-white text-purple-600' : 'bg-white/10 text-gray-500 group-hover:bg-white/20'
                                                }`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span className={`text-xl font-bold leading-snug ${selectedAnswers[currentQuestion] === idx ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                                                }`}>
                                                {option}
                                            </span>
                                        </div>
                                        {selectedAnswers[currentQuestion] === idx && (
                                            <motion.div
                                                layoutId="active-bg"
                                                className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-700"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <footer className="pt-20 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuestion + 1) / (quiz?.questions.length || 1)) * 100}%` }}
                        />
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={selectedAnswers[currentQuestion] === undefined || submitting}
                        className="w-full md:w-auto px-16 py-6 bg-white text-black rounded-[2rem] font-black text-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 flex items-center justify-center gap-4 shadow-3xl"
                    >
                        {submitting ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <>
                                <span>{currentQuestion === (quiz?.questions.length || 0) - 1 ? 'Enviar Examen' : 'Confirmar Respuesta'}</span>
                                <ChevronRight className="h-6 w-6" />
                            </>
                        )}
                    </button>
                </footer>
            </main>
        </div>
    );
};

export default QuizRoom;
