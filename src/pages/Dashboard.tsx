import { useState, useEffect } from 'react';
import {
    Users,
    TrendingUp,
    DollarSign,
    PlayCircle,
    Plus,
    ChevronRight,
    MoreVertical,
    Sparkles,
    User as UserIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const stats = [
    { label: 'Ingresos Totales', value: '$12,450', change: '+12.5%', icon: DollarSign },
    { label: 'Estudiantes Activos', value: '1,432', change: '+8.2%', icon: Users },
    { label: 'Cursos Publicados', value: '12', change: '+2', icon: PlayCircle },
    { label: 'Crecimiento Afiliados', value: '24%', change: '+4.1%', icon: TrendingUp },
];

const recentCourses = [
    { name: 'Machine Learning para Creadores', status: 'Published', students: 450, revenue: '$4,500' },
    { name: 'Nano Learning: Estrategias Rápidas', status: 'Draft', students: 0, revenue: '$0' },
    { name: 'Audio Marketing Automation', status: 'Review', students: 12, revenue: '$120' },
];

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

const Dashboard = () => {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserEmail(user.email ?? null);
            } else {
                navigate('/auth');
            }
        };
        getUser();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-white/5 bg-gradient-to-br from-primary/5 to-background px-10 py-16"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-start justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <h1 className="text-5xl font-bold tracking-tight text-text">KourseOS</h1>
                                <span className="badge-founder flex items-center gap-1">
                                    <Sparkles size={12} />
                                    Founder Edition
                                </span>
                            </div>
                            <h2 className="text-2xl font-semibold text-text/90">
                                El Sistema Operativo para la Nueva Era de la Educación
                            </h2>

                            {/* Welcome Badge Component */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full"
                            >
                                <div className="p-1 bg-primary/20 rounded-full">
                                    <UserIcon size={14} className="text-primary" />
                                </div>
                                <span className="text-sm font-medium text-text">
                                    Bienvenido, <span className="text-primary">{userEmail || 'Cargando...'}</span> — <span className="text-accent font-bold italic">Founder Edition</span>
                                </span>
                            </motion.div>

                            <p className="text-base text-text-muted max-w-2xl leading-relaxed mt-4">
                                Crea tu contenido, gestiona tus afiliados y automatiza tu marketing en un solo motor de IA inteligente.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/generator')}
                            className="btn-primary flex items-center gap-2 px-8 py-3 text-base"
                        >
                            <Plus size={20} />
                            Crear Curso
                        </button>
                    </div>
                </div>
            </motion.header>

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="p-10 max-w-7xl mx-auto space-y-10"
            >
                {/* Stats Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <motion.div variants={itemVariants} key={stat.label} className="surface-card">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                                    <stat.icon className="text-primary" size={20} />
                                </div>
                                <span className="text-xs font-bold text-emerald-400">{stat.change}</span>
                            </div>
                            <p className="text-3xl font-bold text-text mb-1">{stat.value}</p>
                            <p className="text-sm text-text-muted font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </section>

                {/* Courses and Marketing Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main List */}
                    <section className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-text">Infraestructura de Cursos</h3>
                            <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                                Ver todos <ChevronRight size={14} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentCourses.map((course) => (
                                <motion.div variants={itemVariants} key={course.name} className="surface-card flex items-center justify-between group hover:border-primary/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-colors">
                                            <PlayCircle className="text-gray-500 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div>
                                            <h4 className="text-text font-medium">{course.name}</h4>
                                            <p className="text-xs text-text-muted">{course.students} estudiantes · {course.revenue} generados</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${course.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                course.status === 'Draft' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                    'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                            }`}>
                                            {course.status}
                                        </span>
                                        <button className="text-gray-500 hover:text-text transition-colors">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Side Panel: Marketing Intelligence */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Sparkles className="text-primary" size={20} />
                            <h3 className="text-lg font-semibold text-text">Marketing AI Insights</h3>
                        </div>
                        <motion.div variants={itemVariants} className="surface-card bg-gradient-to-br from-primary/10 to-transparent border-primary/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                            <div className="relative z-10">
                                <div className="flex gap-3 mb-4 font-semibold text-xs">
                                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20">#NanoLearning</span>
                                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">#Automation</span>
                                </div>
                                <p className="text-sm text-text/80 leading-relaxed mb-6">
                                    "Detectamos que tus lecciones de audio tienen un <span className="text-primary font-bold">85% más</span> de 'completion rate' que los videos largos. Recomendamos pivotar el Curso de ML a un formato híbrido."
                                </p>
                                <button className="w-full py-2.5 bg-primary rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                    Aplicar Optimización
                                </button>
                            </div>
                        </motion.div>
                    </section>
                </div>
            </motion.main>
        </div>
    );
};

export default Dashboard;
