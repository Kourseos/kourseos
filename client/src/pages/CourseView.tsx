import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
    PlayCircle, BookOpen, Brain,
    Award, ChevronRight, MessageSquare, Sparkles, ShieldCheck,
    ListChecks, Menu, Download, FileText, Presentation, Plus, Save, X, Lock, BrainCircuit,
    Clock, Target, Lightbulb, Zap as ZapIcon
} from 'lucide-react';
import { exportToPDF, exportToWord, exportToPPTX } from '../utils/exportUtils';
import ChatInterface from '../components/ChatInterface';
import GatedContentModal from '../components/GatedContentModal';
import { BRAND_NAME } from '../constants/brand';
import { API_BASE_URL } from '../config/api';

interface Lesson {
    id: string;
    title: string;
    content: string;
    concept?: string;
    explanation?: string;
    action?: string;
    is_free?: boolean;
}

interface Quiz {
    id: string;
    title: string;
}

interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
    quiz?: Quiz;
}

interface Course {
    id: string;
    title: string;
    description: string;
    creator_id?: string;
    creatorId?: string;
    modules: Module[];
}

const CourseView = () => {
    const { i18n } = useTranslation();
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<Course | null>(null);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [showGatedModal, setShowGatedModal] = useState(false);
    const [isLead, setIsLead] = useState(!!localStorage.getItem(`lead_${courseId}`));
    const { token, user } = useAuth();

    const fetchCourse = async () => {
        if (!courseId) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/courses/public/${courseId}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });

            if (response.ok) {
                const data = await response.json();
                setCourse(data);

                if (data.modules && data.modules.length > 0 && data.modules[0].lessons && data.modules[0].lessons.length > 0) {
                    const firstLesson = data.modules[0].lessons[0];
                    setActiveLesson(firstLesson);
                    setEditContent(firstLesson.content);
                }
            }
        } catch (error) {
            console.error('Error fetching course:', error);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [courseId, token]);

    const handleAddModule = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/modules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: 'Nuevo Módulo' })
            });
            if (response.ok) fetchCourse();
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddLesson = async (moduleId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/courses/modules/${moduleId}/lessons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: 'Nueva Lección' })
            });
            if (response.ok) fetchCourse();
        } catch (e) {
            console.error(e);
        }
    };

    if (!course) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary-100 flex overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`flex-shrink-0 bg-white border-r border-gray-100 transition-all duration-500 overflow-hidden relative z-50 ${sidebarOpen ? 'w-96' : 'w-0'}`}
            >
                <div className="h-full flex flex-col w-96">
                    <div className="p-8 border-b border-gray-50 flex items-center gap-4">
                        <div className="p-2.5 bg-gradient-to-br from-primary-600 to-primary-600 rounded-2xl shadow-lg shadow-primary-200">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Curriculum</p>
                            <h2 className="text-lg font-black text-gray-900 leading-tight truncate">{course.title}</h2>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                        {course.modules.map((module, mIdx) => (
                            <div key={module.id} className="space-y-3">
                                <div className="px-4 py-2 flex items-center gap-2">
                                    <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">MÓDULO {mIdx + 1}</span>
                                    <h3 className="text-sm font-black text-gray-900 truncate uppercase tracking-wide flex-1">
                                        {module.title}
                                    </h3>
                                    {user?.role === 'CREATOR' && (
                                        <button
                                            onClick={() => handleAddLesson(module.id)}
                                            className="p-1 hover:bg-primary-100 rounded-md text-primary-600 transition-colors"
                                            title="Añadir Lección"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>

                                <ul className="space-y-1">
                                    {module.lessons.map((lesson) => {
                                        const isLocked = !lesson.is_free && !token;
                                        return (
                                            <li key={lesson.id}>
                                                <button
                                                    onClick={() => {
                                                        if (isLocked) {
                                                            setShowGatedModal(true);
                                                        } else {
                                                            setActiveLesson(lesson);
                                                        }
                                                    }}
                                                    className={`w-full group text-left px-4 py-3.5 rounded-2xl flex items-center gap-3 transition-all ${activeLesson?.id === lesson.id
                                                        ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-100'
                                                        : 'text-gray-500 hover:bg-gray-50/80 hover:text-gray-900'
                                                        } ${isLocked ? 'opacity-60 grayscale' : ''}`}
                                                >
                                                    {isLocked ? (
                                                        <Lock className="h-4 w-4 text-gray-400" />
                                                    ) : activeLesson?.id === lesson.id ? (
                                                        <PlayCircle className="h-5 w-5 text-primary-600 fill-primary-100" />
                                                    ) : (
                                                        <div className="h-2 w-2 rounded-full bg-gray-200 group-hover:bg-primary-300 transition-colors" />
                                                    )}
                                                    <span className="text-sm font-bold flex-1">{lesson.title}</span>
                                                    {lesson.is_free && !token && (
                                                        <span className="text-[8px] font-black bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase">Gratis</span>
                                                    )}
                                                </button>
                                            </li>
                                        );
                                    })}

                                    {module.quiz && (
                                        <li className="pt-2">
                                            <button
                                                onClick={() => navigate(`/quiz/${module.quiz?.id}`)}
                                                className="w-full group text-left px-5 py-4 rounded-[1.5rem] bg-gray-900 text-white flex items-center gap-4 hover:shadow-2xl hover:shadow-primary-500/20 hover:scale-[1.02] transition-all"
                                            >
                                                <div className="p-2 bg-primary-500/20 rounded-xl group-hover:bg-primary-500/30 transition-colors">
                                                    <Brain className="h-5 w-5 text-primary-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="text-[9px] font-black uppercase text-primary-300/60 block tracking-widest">Validación Academia</span>
                                                    <span className="text-sm font-bold truncate block">{module.quiz.title}</span>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white transition-all group-hover:translate-x-1" />
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        ))}

                        {user?.role === 'CREATOR' && (
                            <button
                                onClick={handleAddModule}
                                className="w-full mt-4 p-4 border-2 border-dashed border-gray-100 rounded-[1.5rem] text-gray-400 text-xs font-black flex items-center justify-center gap-2 hover:border-primary-200 hover:text-primary-600 transition-all shadow-sm"
                            >
                                <Plus className="h-4 w-4" /> AÑADIR MÓDULO
                            </button>
                        )}
                    </div>

                    <div className="p-6 border-t border-gray-100 bg-gray-50/30 space-y-4">
                        <button
                            onClick={() => navigate(`/quiz/${courseId}`)}
                            className="w-full relative overflow-hidden p-6 rounded-[2rem] text-white shadow-xl transition-all group border-b-4 border-black/10 active:border-b-0 active:translate-y-1"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-indigo-800 group-hover:scale-110 transition-transform duration-700"></div>
                            <div className="relative flex items-center gap-4">
                                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
                                    <BrainCircuit className="h-6 w-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Evaluación Final</p>
                                    <p className="font-black text-sm">TOMAR EXAMEN IA</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate(`/course/${courseId}/certificate`)}
                            className="w-full relative overflow-hidden p-6 rounded-[2rem] text-white shadow-2xl transition-all group border-b-4 border-black/10 active:border-b-0 active:translate-y-1"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-primary-600 to-pink-500 group-hover:scale-110 transition-transform duration-700"></div>
                            <div className="relative flex items-center gap-4">
                                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
                                    <Award className="h-6 w-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Logro Final</p>
                                    <p className="font-black text-sm">RECLAMAR CERTIFICADO</p>
                                </div>
                                <ShieldCheck className="h-5 w-5 text-white/40 ml-auto group-hover:scale-110 transition-transform" />
                            </div>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-white relative">
                <header className="h-20 bg-white/70 backdrop-blur-2xl px-8 flex justify-between items-center z-40 border-b border-gray-50">
                    <div className="flex items-center gap-6 min-w-0">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 transition-all border border-transparent hover:border-gray-200"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="h-6 w-px bg-gray-100" />
                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Lección Actual</p>
                            <h4 className="font-black text-gray-900 truncate max-w-lg leading-tight">{activeLesson?.title || 'Contenido del curso'}</h4>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                            <button
                                onClick={() => course && exportToPDF(course)}
                                className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-gray-500 hover:text-red-600 transition-all group"
                                title="Exportar PDF"
                            >
                                <FileText className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => course && exportToWord(course)}
                                className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-gray-500 hover:text-blue-600 transition-all"
                                title="Exportar Word"
                            >
                                <Download className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => course && exportToPPTX(course)}
                                className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-gray-500 hover:text-orange-600 transition-all"
                                title="Exportar PowerPoint"
                            >
                                <Presentation className="h-5 w-5" />
                            </button>
                        </div>

                        <button className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all border border-gray-200 shadow-sm">
                            <ZapIcon className="h-4 w-4 text-orange-500 fill-orange-500" />
                            Soporte IA
                        </button>
                        <div className="h-10 w-10 bg-gradient-to-br from-primary-600 to-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary-200 rotate-3">
                            {user?.name?.[0] || 'U'}
                        </div>
                    </div>
                </header>

                <section className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    <div className="max-w-4xl mx-auto px-12 py-20">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeLesson?.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-16"
                            >
                                {activeLesson ? (
                                    <>
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-3">
                                                <div className="flex -space-x-2">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="w-6 h-6 rounded-full bg-primary-100 border-2 border-white flex items-center justify-center">
                                                            <Sparkles className="h-3 w-3 text-primary-600" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-600/60">{BRAND_NAME} ACADEMY</span>
                                            </div>
                                            <div className="flex justify-between items-start w-full">
                                                <h1 className="text-6xl font-black text-gray-900 leading-[1.1] tracking-tight flex-1">
                                                    {activeLesson.title}
                                                </h1>
                                                {user?.role === 'CREATOR' && !isEditing && (
                                                    <button
                                                        onClick={() => setIsEditing(true)}
                                                        className="px-6 py-2 bg-gray-900 text-white rounded-xl text-xs font-black shadow-xl hover:scale-105 transition-transform"
                                                    >
                                                        EDITAR CONTENIDO
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="prose prose-2xl prose-primary max-w-none text-gray-700 leading-relaxed font-medium">
                                            {isEditing ? (
                                                <div className="space-y-6">
                                                    <textarea
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        className="w-full h-[500px] p-8 bg-gray-50 border-2 border-primary-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-primary-500/10 font-mono text-lg text-gray-800"
                                                        placeholder="Escribe el contenido de la lección aquí..."
                                                    />
                                                    <div className="flex gap-4">
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/lessons/${activeLesson.id}`, {
                                                                        method: 'PUT',
                                                                        headers: {
                                                                            'Content-Type': 'application/json',
                                                                            'Authorization': `Bearer ${token}`
                                                                        },
                                                                        body: JSON.stringify({ content: editContent })
                                                                    });
                                                                    if (response.ok) {
                                                                        setActiveLesson({ ...activeLesson, content: editContent });
                                                                        setIsEditing(false);
                                                                    }
                                                                } catch (e) {
                                                                    console.error(e);
                                                                }
                                                            }}
                                                            className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-primary-700 transition-all"
                                                        >
                                                            <Save className="h-5 w-5" /> GUARDAR CAMBIOS
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setIsEditing(false);
                                                                setEditContent(activeLesson.content);
                                                            }}
                                                            className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
                                                        >
                                                            <X className="h-5 w-5" /> CANCELAR
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {activeLesson.content || activeLesson.concept ? (
                                                        <div className="space-y-12">
                                                            {/* Nano Learning Content */}
                                                            <div className="grid grid-cols-1 gap-8">
                                                                {activeLesson.concept && (
                                                                    <div className="bg-primary-50 p-10 rounded-[3rem] border border-primary-100 relative overflow-hidden group">
                                                                        <div className="absolute -top-6 -right-6 h-24 w-24 bg-primary-200/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                                                                        <div className="flex items-center gap-4 mb-6">
                                                                            <div className="p-3 bg-white rounded-2xl shadow-sm">
                                                                                <Lightbulb className="h-6 w-6 text-primary-600" />
                                                                            </div>
                                                                            <span className="text-xs font-black uppercase tracking-widest text-primary-600">Concepto Clave</span>
                                                                        </div>
                                                                        <p className="text-3xl font-black text-gray-900 leading-tight">
                                                                            {activeLesson.concept}
                                                                        </p>
                                                                    </div>
                                                                )}

                                                                <div className="space-y-6">
                                                                    {activeLesson.explanation && (
                                                                        <div className="flex items-center gap-3">
                                                                            <Clock className="h-5 w-5 text-gray-400" />
                                                                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Explicación Rápida (3 min)</span>
                                                                        </div>
                                                                    )}
                                                                    <div
                                                                        className="content-body text-xl font-medium text-gray-600 leading-relaxed"
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: (activeLesson.explanation || activeLesson.content || '')
                                                                                .replace(/#{3} (.*)/g, '<h3 class="text-xl font-bold mt-6 mb-3 text-gray-900">$1</h3>')
                                                                                .replace(/#{2} (.*)/g, '<h2 class="text-2xl font-black mt-8 mb-4 text-primary-900 border-b pb-2">$1</h2>')
                                                                                .replace(/\*\* (.*) \*\*/g, '<strong class="text-gray-900">$1</strong>')
                                                                                .replace(/\n/g, '<br/>')
                                                                        }}
                                                                    />
                                                                </div>

                                                                {activeLesson.action && (
                                                                    <div className="bg-gray-900 p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden">
                                                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                                                            <ZapIcon className="h-20 w-20 text-yellow-400 animate-pulse" />
                                                                        </div>
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="p-3 bg-white/10 rounded-2xl">
                                                                                <Target className="h-6 w-6 text-yellow-400" />
                                                                            </div>
                                                                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Acción Inmediata</span>
                                                                        </div>
                                                                        <div className="space-y-4">
                                                                            <p className="text-2xl font-bold leading-snug">
                                                                                {activeLesson.action}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="p-24 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200 text-center space-y-6">
                                                            <div className="relative inline-block">
                                                                <div className="absolute inset-0 bg-primary-200 blur-2xl rounded-full opacity-50"></div>
                                                                <Brain className="h-16 w-16 text-primary-300 relative" />
                                                            </div>
                                                            <p className="text-gray-400 font-bold text-xl">Esta lección está esperando ser expandida...</p>
                                                            <button
                                                                onClick={async () => {
                                                                    if (!course) return;
                                                                    try {
                                                                        const response = await fetch(`${API_BASE_URL}/api/courses/generate-lesson`, {
                                                                            method: 'POST',
                                                                            headers: {
                                                                                'Content-Type': 'application/json',
                                                                                'Authorization': `Bearer ${token}`
                                                                            },
                                                                            body: JSON.stringify({
                                                                                courseTitle: course.title,
                                                                                lessonTitle: activeLesson.title,
                                                                                language: i18n.language === 'en' ? 'English' : i18n.language === 'pt' ? 'Português' : i18n.language === 'it' ? 'Italiano' : i18n.language === 'zh' ? 'Chinese' : 'Español'
                                                                            })
                                                                        });

                                                                        if (response.ok) {
                                                                            const data = await response.json();
                                                                            setEditContent(data.content);
                                                                            setActiveLesson({ ...activeLesson, ...data });

                                                                            // Auto-save the generated components
                                                                            await fetch(`${API_BASE_URL}/api/courses/${courseId}/lessons/${activeLesson.id}`, {
                                                                                method: 'PUT',
                                                                                headers: {
                                                                                    'Content-Type': 'application/json',
                                                                                    'Authorization': `Bearer ${token}`
                                                                                },
                                                                                body: JSON.stringify({
                                                                                    content: data.content,
                                                                                    concept: data.concept,
                                                                                    explanation: data.explanation,
                                                                                    action: data.action
                                                                                })
                                                                            });

                                                                            fetchCourse();
                                                                        }
                                                                    } catch (e) {
                                                                        console.error(e);
                                                                    }
                                                                }}
                                                                className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-primary-200"
                                                            >
                                                                Generar con un clic
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-600 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                                            <div className="relative bg-white border border-gray-100 rounded-[2.8rem] p-12 flex flex-col lg:flex-row items-center gap-10 shadow-2xl shadow-gray-200/50">
                                                <div className="p-8 bg-primary-50 rounded-[2.2rem]">
                                                    <MessageSquare className="h-10 w-10 text-primary-600" />
                                                </div>
                                                <div className="flex-1 text-center lg:text-left space-y-3">
                                                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">IA Companion Activo</h3>
                                                    <p className="text-gray-500 text-lg leading-relaxed">
                                                        ¿Tienes preguntas sobre <span className="text-primary-600 font-bold">"{activeLesson.title}"</span>?
                                                        Pregúntame cualquier cosa y profundizaré en la teoría o ejemplos técnicos.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setShowChat(true)}
                                                    className="w-full lg:w-auto px-10 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-lg hover:scale-[1.05] transition-transform shadow-xl flex items-center justify-center gap-3"
                                                >
                                                    <span>Chatear ahora</span>
                                                    <ZapIcon className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-40 space-y-8 text-center">
                                        <div className="p-10 bg-gray-50 rounded-[3rem]">
                                            <ListChecks className="h-20 w-20 text-gray-200" />
                                        </div>
                                        <h2 className="text-3xl font-black text-gray-300">Selecciona un tema del curriculum<br />para comenzar tu maestría</h2>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="px-12 pb-12">
                        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '45%' }}
                                className="h-full bg-gradient-to-r from-primary-600 to-blue-600 rounded-full"
                            />
                        </div>
                        <div className="mt-4 flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <span>Progreso del Curso</span>
                            <span>45% COMPLETADO</span>
                        </div>
                    </div>
                </section>
            </main>

            <AnimatePresence>
                {showChat && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowChat(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-md"
                        />
                        <div className="relative z-10 w-full max-w-lg">
                            <ChatInterface
                                courseId={courseId || ''}
                                onClose={() => setShowChat(false)}
                            />
                        </div>
                    </div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showGatedModal && (
                    <GatedContentModal
                        courseId={courseId || ''}
                        creatorId={course?.creator_id || course?.creatorId || ''}
                        onUnlock={() => {
                            setIsLead(true);
                            setShowGatedModal(false);
                        }}
                        onClose={() => setShowGatedModal(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default CourseView;
