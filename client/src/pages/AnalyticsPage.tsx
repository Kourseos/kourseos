import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp, Users, Brain,
    ArrowLeft, CheckCircle2,
    AlertCircle, Sparkles, Filter, Calendar,
    Activity, MessageSquare, Lightbulb,
    UserCheck, PlayCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

interface Suggestion {
    id: string;
    type: 'CONTENT_GAP' | 'CONFUSING_EXPLANATION' | 'TYPO';
    suggestion: string;
    context: string | null;
    createdAt: string;
    resolved: boolean;
}

interface Course {
    id: string;
    title: string;
    description: string;
    createdAt: string;
}

const AnalyticsPage = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string | 'all'>('all');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch courses
                const coursesRes = await fetch(`${API_BASE_URL}/api/courses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (coursesRes.ok) {
                    const data = await coursesRes.json();
                    setCourses(data);

                    // Fetch all suggestions if "all" or specific
                    fetchAllSuggestions(data);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchData();
    }, [token]);

    const fetchAllSuggestions = async (courseList: Course[]) => {
        try {
            const allSugg: Suggestion[] = [];
            for (const course of courseList) {
                const res = await fetch(`${API_BASE_URL}/api/courses/${course.id}/optimizations`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    allSugg.push(...data);
                }
            }
            setSuggestions(allSugg);
        } catch (e) {
            console.error(e);
        }
    };

    const handleResolve = async (id: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/courses/optimizations/${id}/resolve`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setSuggestions(suggestions.filter(s => s.id !== id));
            }
        } catch (e) {
            console.error(e);
        }
    };


    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-purple-100 selection:text-purple-900">
            {/* Sidebar-lite or Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2.5 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-500" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-gray-900 leading-none mb-1">Crescimento & Insights</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                <Brain className="h-3 w-3 text-purple-500" />
                                Potenciado por IA Avanzada
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                            <button className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all bg-white text-gray-900 shadow-sm">Vista General</button>
                            <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-gray-600 transition-all">Reportes</button>
                        </div>
                        <div className="h-8 w-px bg-gray-100 mx-2"></div>
                        <button className="p-2.5 text-gray-400 hover:text-purple-600 transition-colors">
                            <Calendar className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Inscripciones Totales', value: '1,284', change: '+12.5%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Tasa de Finalización', value: '68%', change: '+4.2%', icon: PlayCircle, color: 'text-green-600', bg: 'bg-green-50' },
                        { label: 'Ingresos Brutos', value: '$24,450', change: '+18.1%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                        { label: 'NPS Estudiantes', value: '4.8', change: '+0.3', icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <span className="flex items-center text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content: Optimization Agent */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden">
                            {/* Decorative Sparkle */}
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                                <Brain className="h-64 w-64 rotate-12" />
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
                                        <Sparkles className="h-6 w-6 text-purple-500" />
                                        Optimizador de IA
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium">
                                        Analizamos las dudas de tus estudiantes para mejorar tu contenido automáticamente.
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <select
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                        className="bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                                    >
                                        <option value="all">Todos los Cursos</option>
                                        {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                    </select>
                                    <button className="p-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-all">
                                        <Filter className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="py-20 flex flex-col items-center gap-4">
                                    <div className="relative">
                                        <div className="h-12 w-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
                                        <Brain className="h-6 w-6 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <p className="text-gray-400 font-bold text-sm animate-pulse">Sincronizando con Agente Tutor...</p>
                                </div>
                            ) : suggestions.length === 0 ? (
                                <div className="py-20 text-center space-y-6">
                                    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto ring-8 ring-white">
                                        <CheckCircle2 className="h-10 w-10 text-green-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-black text-gray-900">¡Tu contenido está sólido!</h4>
                                        <p className="text-sm text-gray-400 max-w-xs mx-auto">
                                            No hemos detectado vacíos de información o confusiones en las interacciones recientes.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {suggestions.map((sugg, idx) => (
                                            <motion.div
                                                key={sugg.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="group p-6 bg-[#FAFBFF] rounded-3xl border border-blue-50/50 hover:bg-white hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                                            >
                                                {/* Left Indicator */}
                                                <div className={`absolute top-0 left-0 w-1.5 h-full ${sugg.type === 'CONTENT_GAP' ? 'bg-amber-400' :
                                                    sugg.type === 'CONFUSING_EXPLANATION' ? 'bg-blue-400' : 'bg-red-400'
                                                    }`}></div>

                                                <div className="flex justify-between items-start gap-6">
                                                    <div className="flex-1 space-y-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${sugg.type === 'CONTENT_GAP' ? 'bg-amber-100 text-amber-700' :
                                                                sugg.type === 'CONFUSING_EXPLANATION' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                {sugg.type === 'CONTENT_GAP' ? 'Hueco de Contenido' :
                                                                    sugg.type === 'CONFUSING_EXPLANATION' ? 'Explicación Confusa' : 'Error Detectado'}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                                                {new Date(sugg.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <h4 className="text-lg font-black text-gray-900 leading-snug">
                                                                {sugg.suggestion}
                                                            </h4>
                                                            {sugg.context && (
                                                                <div className="p-4 bg-white/50 border border-gray-100 rounded-2xl">
                                                                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                                                                        <MessageSquare className="h-3 w-3" />
                                                                        <span className="text-[10px] font-black uppercase tracking-widest">Pregunta del Alumno</span>
                                                                    </div>
                                                                    <p className="text-sm italic text-gray-600">"{sugg.context}"</p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-4 pt-2">
                                                            <button
                                                                onClick={() => handleResolve(sugg.id)}
                                                                className="flex items-center gap-2 text-xs font-black text-green-600 hover:bg-green-50 px-4 py-2 rounded-xl transition-colors"
                                                            >
                                                                <CheckCircle2 className="h-4 w-4" />
                                                                Confirmar Mejora
                                                            </button>
                                                            <button className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-gray-600 px-4 py-2 rounded-xl transition-colors">
                                                                Ignorar
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="hidden sm:block">
                                                        <div className="p-4 bg-white rounded-2xl border border-gray-50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Lightbulb className="h-5 w-5 text-purple-400" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar Widgets */}
                    <div className="space-y-8">
                        {/* Activity Feed */}
                        <section className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-blue-500" />
                                Actividad Crítica
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { title: 'Nueva venta: "Estrategia Digital"', time: 'Hace 5m', icon: TrendingUp, color: 'text-green-600' },
                                    { title: '3 alumnos fallaron el Quiz 1', time: 'Hace 12m', icon: AlertCircle, color: 'text-red-500' },
                                    { title: 'Sugerencia de IA generada', time: 'Hace 1h', icon: Sparkles, color: 'text-purple-500' },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 group cursor-pointer">
                                        <div className={`p-2.5 rounded-xl bg-gray-50 ${item.color} group-hover:scale-110 transition-transform`}>
                                            <item.icon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors">
                                Ver Registro Completo
                            </button>
                        </section>

                        {/* Funnel Widget */}
                        <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <h3 className="text-lg font-black mb-6 relative z-10">Embudo de Conversión</h3>
                            <div className="space-y-4 relative z-10">
                                {[
                                    { label: 'Visitas Landing', value: '4.2k', p: '100%' },
                                    { label: 'Checkout', value: '840', p: '20%' },
                                    { label: 'Ventas Reales', value: '124', p: '3%' },
                                ].map((step, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-gray-400">{step.label}</span>
                                            <span>{step.value}</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: step.p }}
                                                transition={{ duration: 1, delay: i * 0.2 }}
                                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AnalyticsPage;
