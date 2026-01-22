import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Sparkles, ArrowLeft, BookOpen, Layers, CheckCircle2,
    AlertCircle, Loader2, Wand2, Save, ChevronRight, Edit3, Trash2, Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

interface Lesson {
    title: string;
    content: string;
}

interface Module {
    title: string;
    lessons: Lesson[];
}

interface Email {
    subject: string;
    body: string;
}

interface LandingPage {
    h1: string;
    h2: string;
    benefits: string[];
    socialProof: { name: string; text: string }[];
    bonuses: { title: string; description: string }[];
    offer: string;
    faqs: { q: string; a: string }[];
}

interface Curriculum {
    title: string;
    description: string;
    modules: Module[];
    landingPage?: LandingPage;
    emailSequence?: Email[];
}

const CourseCreator = () => {
    const { t, i18n } = useTranslation();
    const [topic, setTopic] = useState('');
    const [userPrompt, setUserPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'input' | 'generating' | 'review'>('input');
    const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
    const [price, setPrice] = useState('49.90');
    const [paymentType, setPaymentType] = useState<'ONE_TIME' | 'SUBSCRIPTION'>('ONE_TIME');
    const [activeTab, setActiveTab] = useState<'curriculum' | 'landing' | 'emails'>('curriculum');
    const [saving, setSaving] = useState(false);
    const { token } = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setStep('generating');
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/courses/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    topic,
                    userPrompt,
                    language: i18n.language === 'en' ? 'English' : i18n.language === 'pt' ? 'Português' : i18n.language === 'it' ? 'Italiano' : i18n.language === 'zh' ? 'Chinese' : 'Español'
                }),
            });

            if (response.status === 401 || response.status === 403) {
                // Token inválido, forzar logout/login
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
            }

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || `Error ${response.status}: Failed to generate`);
            }

            const data = await response.json();
            setCurriculum(data.curriculum);
            setStep('review');
        } catch (error: any) {
            console.error('Error generating course:', error);
            setStep('input');
            setError(error.message || 'Ocurrió un error inesperado al generar el curso.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!curriculum) return;
        setSaving(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/supabase/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...curriculum,
                    price: parseFloat(price),
                    paymentType,
                    emailSequence: curriculum.emailSequence,
                    advancedLanding: curriculum.advancedLanding
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to save course');
            }

            navigate('/dashboard');
        } catch (error: any) {
            console.error('Error saving course:', error);
            setError(error.message || 'Error al guardar el curso.');
        } finally {
            setSaving(false);
        }
    };

    const updateModuleTitle = (mIndex: number, newTitle: string) => {
        if (!curriculum) return;
        const newModules = [...curriculum.modules];
        newModules[mIndex].title = newTitle;
        setCurriculum({ ...curriculum, modules: newModules });
    };

    const updateLessonTitle = (mIndex: number, lIndex: number, newTitle: string) => {
        if (!curriculum) return;
        const newModules = [...curriculum.modules];
        newModules[mIndex].lessons[lIndex].title = newTitle;
        setCurriculum({ ...curriculum, modules: newModules });
    };

    const deleteLesson = (mIndex: number, lIndex: number) => {
        if (!curriculum) return;
        const newModules = [...curriculum.modules];
        newModules[mIndex].lessons.splice(lIndex, 1);
        setCurriculum({ ...curriculum, modules: newModules });
    };

    const deleteModule = (mIndex: number) => {
        if (!curriculum) return;
        const newModules = [...curriculum.modules];
        newModules.splice(mIndex, 1);
        setCurriculum({ ...curriculum, modules: newModules });
    };

    const addModule = () => {
        if (!curriculum) return;
        const newModule: Module = {
            title: "Nuevo Módulo",
            lessons: [{ title: "Primera Lección", content: "" }]
        };
        setCurriculum({ ...curriculum, modules: [...curriculum.modules, newModule] });
    };

    const addLesson = (mIndex: number) => {
        if (!curriculum) return;
        const newModules = [...curriculum.modules];
        newModules[mIndex].lessons.push({ title: "Nueva Lección", content: "" });
        setCurriculum({ ...curriculum, modules: newModules });
    };

    const updateLandingField = (field: keyof LandingPage, value: any) => {
        if (!curriculum || !curriculum.landingPage) return;
        setCurriculum({
            ...curriculum,
            landingPage: {
                ...curriculum.landingPage,
                [field]: value
            }
        });
    };

    const updateNestedLandingField = (field: 'socialProof' | 'bonuses' | 'faqs', index: number, subField: string, value: any) => {
        if (!curriculum || !curriculum.landingPage) return;
        const newArray = [...(curriculum.landingPage[field] as any)];
        newArray[index] = { ...newArray[index], [subField]: value };
        updateLandingField(field, newArray);
    };

    const updateLandingBenefit = (index: number, value: string) => {
        if (!curriculum || !curriculum.landingPage) return;
        const newBenefits = [...curriculum.landingPage.benefits];
        newBenefits[index] = value;
        updateLandingField('benefits', newBenefits);
    };

    return (
        <div className="min-h-screen bg-white overflow-hidden font-sans selection:bg-purple-100 selection:text-purple-900">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard')}
                            className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-500 border border-transparent hover:border-gray-200 transition-all"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </motion.button>

                        <div className="flex items-center gap-3 group px-2">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <span className="text-xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                SkillForge AI
                            </span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {['nav.home', 'generating', 'review'].map((label, i) => {
                            const stepsMap = { 0: 'input', 1: 'generating', 2: 'review' };
                            const labelMap: Record<number, string> = { 0: t('nav.home'), 1: 'Generación', 2: 'Revisión' };
                            // @ts-ignore
                            const isActive = step === stepsMap[i];
                            return (
                                <div key={label} className="flex items-center gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${isActive
                                        ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-200 shadow-sm'
                                        : 'text-gray-400'
                                        }`}>
                                        {labelMap[i]}
                                    </span>
                                    {i < 2 && <ChevronRight className="h-4 w-4 text-gray-300" />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-12">
                <AnimatePresence mode="wait">
                    {step === 'input' && (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="max-w-3xl mx-auto text-center relative"
                        >
                            <div className="mb-12 relative inline-block">
                                <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full animate-pulse"></div>
                                <div className="relative p-6 bg-white rounded-[2rem] shadow-2xl shadow-purple-200/50 border border-purple-100">
                                    <Wand2 className="h-10 w-10 text-purple-600 focus:rotate-12 transition-transform" />
                                </div>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 leading-tight">
                                    ¿Qué conocimiento quieres
                                    <br />
                                </span>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                                    compartir hoy?
                                </span>
                            </h1>

                            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                                Deja que nuestra <span className="text-purple-600 font-bold">IA avanzada</span> diseñe la estructura perfecta para tu próximo éxito educativo.
                            </p>

                            <form onSubmit={handleGenerate} className="relative z-10">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-8 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-red-500/10"
                                    >
                                        <AlertCircle className="h-5 w-5" />
                                        <span className="font-bold">{error}</span>
                                    </motion.div>
                                )}

                                <div className="max-w-2xl mx-auto space-y-6">
                                    <div className="relative group">
                                        <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-500 animate-gradient"></div>
                                        <div className="relative flex p-2 bg-white rounded-[1.8rem] shadow-2xl border border-gray-100 overflow-hidden">
                                            <input
                                                type="text"
                                                value={topic}
                                                onChange={(e) => setTopic(e.target.value)}
                                                placeholder="¿Sobre qué quieres crear el curso?"
                                                className="flex-1 p-6 text-xl bg-transparent border-none rounded-2xl outline-none placeholder-gray-400 text-gray-900 font-bold"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="relative group/prompt"
                                    >
                                        <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-100 rounded-[1.5rem] blur opacity-20 group-hover/prompt:opacity-40 transition duration-500"></div>
                                        <div className="relative p-5 bg-white/80 backdrop-blur-xl rounded-[1.5rem] border border-white shadow-xl">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="p-1.5 bg-purple-100 rounded-lg">
                                                    <Sparkles className="h-4 w-4 text-purple-600" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Personalización Natural (Opcional)</span>
                                            </div>
                                            <textarea
                                                value={userPrompt}
                                                onChange={(e) => setUserPrompt(e.target.value)}
                                                placeholder="Ej: 'Hazlo para arquitectos senior', 'Usa analogías de cocina', 'Incluye muchos ejercicios prácticos'..."
                                                className="w-full min-h-[120px] p-0 text-gray-600 bg-transparent border-none outline-none resize-none placeholder-gray-300 font-medium leading-relaxed"
                                            />
                                        </div>
                                    </motion.div>

                                    <div className="flex justify-center pt-6">
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="submit"
                                            disabled={!topic.trim() || loading}
                                            className="px-12 py-5 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-800 text-white rounded-[2rem] font-black text-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(147,51,234,0.4)] transition-all disabled:opacity-50 flex items-center gap-4 group/btn relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                            <Wand2 className="h-6 w-6 text-purple-400 group-hover/btn:rotate-12 transition-transform" />
                                            <span>{loading ? 'Orquestando...' : 'Generar Curso'}</span>
                                            <ChevronRight className="h-5 w-5 opacity-50 group-hover/btn:translate-x-1 transition-transform" />
                                        </motion.button>
                                    </div>
                                </div>
                            </form>

                            <div className="mt-12 grid grid-cols-3 gap-4 text-left">
                                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                                        <Layers className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <h3 className="font-bold text-sm mb-1">Estructura Modular</h3>
                                    <p className="text-xs text-gray-500">Organización lógica automática</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <div className="h-8 w-8 bg-purple-50 rounded-lg flex items-center justify-center mb-3">
                                        <BookOpen className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <h3 className="font-bold text-sm mb-1">Contenido Rico</h3>
                                    <p className="text-xs text-gray-500">Lecciones detalladas y ejemplos</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <div className="h-8 w-8 bg-green-50 rounded-lg flex items-center justify-center mb-3">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    </div>
                                    <h3 className="font-bold text-sm mb-1">Evaluaciones</h3>
                                    <p className="text-xs text-gray-500">Quizzes generados por IA</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 'generating' && (
                        <motion.div
                            key="generating"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20 min-h-[60vh] text-center"
                        >
                            <div className="relative w-48 h-48 mb-12">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping opacity-20"></div>
                                <div className="absolute inset-[-20%] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl animate-blob opacity-40"></div>
                                <div className="relative bg-white/80 backdrop-blur-3xl rounded-[2.5rem] w-full h-full flex items-center justify-center shadow-[0_32px_64px_-16px_rgba(147,51,234,0.3)] border border-purple-100">
                                    <motion.div
                                        animate={{
                                            rotate: [0, 360],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{
                                            duration: 5,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                    >
                                        <Sparkles className="h-20 w-20 text-purple-600 drop-shadow-[0_0_15px_rgba(147,51,234,0.5)]" />
                                    </motion.div>
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                                    La IA está orquestando tu curso...
                                </h2>
                                <div className="flex flex-col gap-4 max-w-sm mx-auto">
                                    {[
                                        { label: `Analizando expertis en "${topic}"`, color: 'bg-blue-100 text-blue-700' },
                                        { label: 'Estructurando arquitectura modular', color: 'bg-purple-100 text-purple-700' },
                                        { label: 'Generando contenido instruccional', color: 'bg-pink-100 text-pink-700' }
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.4 }}
                                            className={`px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-sm ${item.color}`}
                                        >
                                            <div className="h-2 w-2 rounded-full bg-current animate-pulse"></div>
                                            {item.label}
                                        </motion.div>
                                    ))}
                                </div>
                                <p className="text-gray-400 font-medium animate-pulse mt-8">Esto tomará unos segundos...</p>
                            </motion.div>
                        </motion.div>
                    )}

                    {step === 'review' && curriculum && (
                        <motion.div
                            key="review"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Tabs Header */}
                            <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit mx-auto mb-8">
                                <button
                                    onClick={() => setActiveTab('curriculum')}
                                    className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'curriculum' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Contenido del Curso
                                </button>
                                <button
                                    onClick={() => setActiveTab('landing')}
                                    className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'landing' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Landing Page de Ventas
                                </button>
                                <button
                                    onClick={() => setActiveTab('emails')}
                                    className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'emails' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Email Marketing
                                </button>
                            </div>

                            <div className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden ring-1 ring-black/5">
                                {activeTab === 'curriculum' ? (
                                    <>
                                        <div className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 p-10 text-white relative h-64 flex flex-col justify-end">
                                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                                <BookOpen className="h-48 w-48 -rotate-12" />
                                            </div>
                                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <span className="px-3 py-1 bg-purple-500/20 backdrop-blur-md rounded-full text-xs font-bold ring-1 ring-purple-400/30">
                                                            CONTENIDO ESTRUCTURADO
                                                        </span>
                                                    </div>
                                                    <h2 className="text-4xl font-black mb-3 tracking-tight">{curriculum.title}</h2>
                                                    <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">{curriculum.description}</p>
                                                </div>
                                                <div className="bg-white/10 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/20 flex flex-col items-center">
                                                    <span className="text-3xl font-black">{curriculum.modules.length}</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Módulos</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-10 space-y-8">
                                            {/* Pricing Settings */}
                                            <div className="flex flex-col md:flex-row gap-6 p-8 bg-purple-50 rounded-[2rem] border border-purple-100">
                                                <div className="flex-1 space-y-4">
                                                    <h4 className="font-black text-purple-900 flex items-center gap-2">
                                                        <Sparkles className="h-4 w-4" /> Configuración Comercial
                                                    </h4>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 block mb-1">Precio sugerido ($)</label>
                                                            <input
                                                                type="text"
                                                                value={price}
                                                                onChange={(e) => setPrice(e.target.value)}
                                                                className="w-full p-4 bg-white rounded-xl border border-purple-200 text-2xl font-black text-purple-700 outline-none focus:ring-2 focus:ring-purple-400"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 block mb-1">Modelo de cobro</label>
                                                            <select
                                                                value={paymentType}
                                                                // @ts-ignore
                                                                onChange={(e) => setPaymentType(e.target.value)}
                                                                className="w-full p-4 bg-white rounded-xl border border-purple-200 text-lg font-bold text-purple-700 outline-none appearance-none"
                                                            >
                                                                <option value="ONE_TIME">Pago Único</option>
                                                                <option value="SUBSCRIPTION">Suscripción Mensual</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid gap-6">
                                                {curriculum.modules.map((module, mIndex) => (
                                                    <motion.div
                                                        key={mIndex}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: mIndex * 0.1 }}
                                                        className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                                                    >
                                                        <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex justify-between items-center group-hover:bg-purple-50/30 transition-colors">
                                                            <div className="flex items-center gap-4 flex-1">
                                                                <div className="w-10 h-10 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center font-black text-purple-600">
                                                                    {mIndex + 1}
                                                                </div>
                                                                <input
                                                                    className="text-xl font-bold text-gray-900 bg-transparent border-none focus:ring-0 p-0 w-full"
                                                                    value={module.title}
                                                                    onChange={(e) => updateModuleTitle(mIndex, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="p-4 space-y-2">
                                                            {module.lessons.map((lesson, lIndex) => (
                                                                <div key={lIndex} className="p-3 rounded-xl hover:bg-gray-50 flex items-center gap-3">
                                                                    <Edit3 className="h-4 w-4 text-gray-300" />
                                                                    <input
                                                                        className="text-gray-700 font-medium flex-1 bg-transparent border-none focus:ring-0 p-0"
                                                                        value={lesson.title}
                                                                        onChange={(e) => updateLessonTitle(mIndex, lIndex, e.target.value)}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-10 space-y-12">
                                        <div className="space-y-4">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500">Editor de Landing Profesional</h3>
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 mb-2 block">H1 - Titular de Gancho</label>
                                                    <textarea
                                                        className="w-full p-6 text-3xl font-black text-gray-900 bg-gray-50 rounded-3xl border-none focus:ring-2 focus:ring-purple-400 outline-none"
                                                        value={curriculum.landingPage?.h1}
                                                        onChange={(e) => updateLandingField('h1', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 mb-2 block">H2 - Promesa de Valor</label>
                                                    <textarea
                                                        className="w-full p-6 text-xl font-bold text-gray-600 bg-gray-50 rounded-3xl border-none focus:ring-2 focus:ring-purple-400 outline-none"
                                                        value={curriculum.landingPage?.h2}
                                                        onChange={(e) => updateLandingField('h2', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <h4 className="font-black text-gray-900 flex items-center gap-2">
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" /> Beneficios Clave
                                                </h4>
                                                <div className="space-y-3">
                                                    {curriculum.landingPage?.benefits.map((benefit, i) => (
                                                        <input
                                                            key={i}
                                                            className="w-full p-4 bg-gray-50 rounded-xl border-none font-medium text-gray-700"
                                                            value={benefit}
                                                            onChange={(e) => updateLandingBenefit(i, e.target.value)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="font-black text-gray-900 flex items-center gap-2">
                                                    <Sparkles className="h-5 w-5 text-yellow-500" /> Bonos con Urgencia
                                                </h4>
                                                <div className="space-y-4">
                                                    {curriculum.landingPage?.bonuses.map((bonus, i) => (
                                                        <div key={i} className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                                                            <input
                                                                className="font-black text-yellow-900 bg-transparent border-none w-full mb-1 p-0"
                                                                value={bonus.title}
                                                                onChange={(e) => updateNestedLandingField('bonuses', i, 'title', e.target.value)}
                                                            />
                                                            <input
                                                                className="text-xs text-yellow-700 bg-transparent border-none w-full p-0"
                                                                value={bonus.description}
                                                                onChange={(e) => updateNestedLandingField('bonuses', i, 'description', e.target.value)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-black text-gray-900">Preguntas Frecuentes (FAQs)</h4>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {curriculum.landingPage?.faqs.map((faq, i) => (
                                                    <div key={i} className="p-6 bg-gray-50 rounded-2xl">
                                                        <input
                                                            className="font-bold text-gray-900 bg-transparent border-none w-full mb-2 p-0"
                                                            value={faq.q}
                                                            onChange={(e) => updateNestedLandingField('faqs', i, 'q', e.target.value)}
                                                        />
                                                        <textarea
                                                            className="text-sm text-gray-500 bg-transparent border-none w-full p-0 h-20 outline-none"
                                                            value={faq.a}
                                                            onChange={(e) => updateNestedLandingField('faqs', i, 'a', e.target.value)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'emails' && (
                                    <div className="p-10 space-y-12">
                                        <div className="space-y-4">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500">Secuencia de Emails Automáticos</h3>
                                            <p className="text-gray-500 text-sm">Estos correos se enviarán automáticamente para convertir prospectos en alumnos.</p>
                                        </div>

                                        <div className="space-y-8">
                                            {curriculum.emailSequence?.map((email, i) => (
                                                <div key={i} className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-xs">
                                                            {i + 1}
                                                        </div>
                                                        <span className="font-bold text-gray-900 uppercase text-xs tracking-widest">Email {i === 0 ? 'de Bienvenida' : i === 1 ? 'de Valor' : 'de Cierre'}</span>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Asunto del Email</label>
                                                        <input
                                                            className="w-full p-4 bg-white rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-purple-400 outline-none"
                                                            value={email.subject}
                                                            onChange={(e) => {
                                                                const newSeq = [...(curriculum.emailSequence || [])];
                                                                newSeq[i].subject = e.target.value;
                                                                setCurriculum({ ...curriculum, emailSequence: newSeq });
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Cuerpo del Mensaje (Markdown)</label>
                                                        <textarea
                                                            className="w-full p-6 bg-white rounded-xl border-none text-gray-600 font-medium h-48 focus:ring-2 focus:ring-purple-400 outline-none"
                                                            value={email.body}
                                                            onChange={(e) => {
                                                                const newSeq = [...(curriculum.emailSequence || [])];
                                                                newSeq[i].body = e.target.value;
                                                                setCurriculum({ ...curriculum, emailSequence: newSeq });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-center md:justify-end gap-6 pb-20">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setStep('input')}
                                    className="px-10 py-5 bg-white text-gray-700 font-black rounded-2xl hover:bg-gray-50 transition-all shadow-sm border border-gray-200"
                                >
                                    Descartar
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black rounded-2xl hover:shadow-xl transition-all flex items-center gap-4 disabled:opacity-70 group"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                            <span>Desplegando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                                            <span>Publicar y Activar Ventas</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default CourseCreator;
