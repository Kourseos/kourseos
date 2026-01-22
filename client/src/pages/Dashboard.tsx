import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Plus, LogOut, BookOpen, Users, TrendingUp, Award,
    Sparkles, BarChart3, Settings, Bell, Search,
    LayoutDashboard, GraduationCap, ChevronRight, Code2,
    DollarSign, Ticket, Activity, Trash2, Wallet, Zap, Shield,
    Clock, Flashlight, Target
} from 'lucide-react';
import RankInfoModal from '../components/RankInfoModal';
import { BRAND_NAME } from '../constants/brand';
import { API_BASE_URL } from '../config/api';

const Dashboard = () => {
    const { t } = useTranslation();
    const { user, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    // State for courses
    const [courses, setCourses] = useState<any[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const { token } = useAuth();

    const [certificatesCount, setCertificatesCount] = useState(0);

    const [salesData, setSalesData] = useState<any>({ sales: [], totalRevenue: 0, salesCount: 0 });
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loadingSales, setLoadingSales] = useState(true);
    const [showRankModal, setShowRankModal] = useState(false);

    // Lógica de Rank
    const getRankInfo = (sales: number) => {
        if (sales >= 200) return { name: 'Oro', next: null, fee: 3, target: 200 };
        if (sales >= 50) return { name: 'Plata', next: 'Oro', fee: 4, target: 200 };
        return { name: 'Bronce', next: 'Plata', fee: 5, target: 50 };
    };

    const rankInfo = getRankInfo(salesData.salesCount);

    const fetchSales = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/payments/report`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setSalesData(data);
            }
        } catch (e) { console.error(e); } finally { setLoadingSales(false); }
    };

    const fetchCoupons = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/payments/coupons`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCoupons(data);
            }
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/supabase/courses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                }
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            } finally {
                setLoadingCourses(false);
            }
        };

        const fetchCertificates = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/courses/explorer/certificates`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setCertificatesCount(data.length);
                }
            } catch (e) { console.error(e); }
        };

        if (token) {
            fetchCourses();
            if (user?.role === 'CREATOR') {
                fetchCertificates();
                fetchSales();
                fetchCoupons();
            }
        }
    }, [token, user?.role]);

    // Mock/Real data for stats
    const stats = [
        { label: 'Cursos Activos', value: courses.length.toString(), change: '+12%', icon: BookOpen, bg: 'bg-blue-50 text-blue-600' },
        { label: 'Ingresos Totales', value: `$${salesData.totalRevenue.toFixed(2)}`, change: '+25%', icon: DollarSign, bg: 'bg-green-50 text-green-600' },
        { label: 'Ventas Totales', value: salesData.salesCount.toString(), change: '+5%', icon: TrendingUp, bg: 'bg-purple-50 text-purple-600' },
        { label: 'Certificados', value: certificatesCount.toString(), change: '+18%', icon: Award, bg: 'bg-orange-50 text-orange-600' }
    ];

    const handleCreateCoupon = async () => {
        const code = prompt("Código del cupón (ej: PROMO20):");
        const discount = prompt("Porcentaje de descuento:");
        if (!code || !discount) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/payments/coupons`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code, discount: parseFloat(discount) })
            });
            if (response.ok) fetchCoupons();
        } catch (e) { console.error(e); }
    };

    const toggleCoupon = async (id: string, active: boolean) => {
        try {
            await fetch(`${API_BASE_URL}/api/payments/coupons/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ active })
            });
            fetchCoupons();
        } catch (e) { console.error(e); }
    };

    if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-12 w-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
    </div>;

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col fixed h-full z-20">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-xl">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        {BRAND_NAME}
                    </span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-6">
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-700 rounded-xl font-medium transition-colors">
                        <LayoutDashboard className="h-5 w-5" />
                        {t('nav.home')}
                    </Link>
                    <Link to="/courses" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
                        <BookOpen className="h-5 w-5" />
                        {t('nav.courses')}
                    </Link>
                    <Link to="/students" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
                        <Users className="h-5 w-5" />
                        Estudiantes
                    </Link>
                    <Link to="/analytics" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
                        <BarChart3 className="h-5 w-5" />
                        Análisis
                    </Link>
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
                        <Settings className="h-5 w-5" />
                        Configuración
                    </Link>
                    <Link to="/affiliates" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
                        <Users className="h-5 w-5" />
                        Afiliados
                    </Link>
                    <Link to="/wallet" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
                        <Wallet className="h-5 w-5" />
                        Billetera
                    </Link>
                    {user?.role === 'CREATOR' && (
                        <Link to="/developers" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors border-t border-gray-100 pt-5 mt-5">
                            <Code2 className="h-5 w-5" />
                            Developers
                        </Link>
                    )}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                        <h4 className="font-bold mb-1 relative z-10">Plan {user?.plan || 'Free'}</h4>
                        <p className="text-xs text-gray-300 mb-3 relative z-10">Desbloquea todo el potencial</p>
                        <button className="w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-xs font-semibold transition-colors border border-white/10">
                            Mejorar Plan
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
                {/* Top Header */}
                <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-10 px-8 flex justify-between items-center">
                    <div className="flex items-center gap-4 lg:hidden">
                        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-xl">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                    </div>

                    <div className="flex-1 max-w-xl mx-auto hidden md:block">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar cursos, estudiantes..."
                                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-100 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Bell className="h-6 w-6" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <LanguageSelector />

                        <div className="h-8 w-px bg-gray-200"></div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                            </div>
                            <div className="relative group cursor-pointer">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 p-0.5">
                                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8 max-w-7xl mx-auto w-full">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="space-y-8"
                    >
                        {/* Welcome Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                                    {t('dashboard.welcome')}, <span className="text-primary-600">{user?.name}</span> 👋
                                </h1>
                                <p className="text-gray-500 font-medium">{t('dashboard.subtitle')}</p>
                            </div>

                            {user?.role === 'CREATOR' && (
                                <div className="flex items-center gap-4">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center gap-6"
                                    >
                                        <div className="space-y-2 flex-1 min-w-[200px]">
                                            <div className="flex justify-between items-end mb-1">
                                                <div className="flex items-center gap-2">
                                                    <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Progreso de Rank</span>
                                                </div>
                                                <span className="text-xs font-bold text-primary-600">{rankInfo.name}</span>
                                            </div>
                                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min((salesData.salesCount / rankInfo.target) * 100, 100)}%` }}
                                                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                                                />
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-500">
                                                {rankInfo.next
                                                    ? `¡Estás a solo ${rankInfo.target - salesData.salesCount} ventas de reducir tu comisión al ${rankInfo.fee - 1}%!`
                                                    : '¡Has alcanzado el rango máximo! Tasa de 3% activa.'
                                                }
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setShowRankModal(true)}
                                            className="p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors group"
                                        >
                                            <Shield className="h-6 w-6 text-primary-600 group-hover:scale-110 transition-transform" />
                                        </button>
                                    </motion.div>

                                    <Link
                                        to="/create-course"
                                        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all hover:scale-105 shadow-lg shadow-gray-900/20 h-fit"
                                    >
                                        <Plus className="h-5 w-5" />
                                        Crear Curso
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Stats Grid */}
                        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                                            <stat.icon className="h-6 w-6" />
                                        </div>
                                        <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                            <TrendingUp className="h-3 w-3 mr-1" />
                                            {stat.change}
                                        </span>
                                    </div>
                                    <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
                                    <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* Quick Learning Section (Nano Learning) */}
                        {user?.role === 'STUDENT' && courses.length > 0 && (
                            <motion.div variants={item} className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                        <Clock className="h-6 w-6 text-primary-600" />
                                        Nano Learning: Pasos Rápidos
                                    </h2>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Menos de 5 min</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {courses[0].modules?.[0]?.lessons?.slice(0, 3).map((lesson: any, idx: number) => (
                                        <div
                                            key={idx}
                                            onClick={() => navigate(`/course/${courses[0].id}`)}
                                            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                <Flashlight className="h-12 w-12 text-primary-600" />
                                            </div>
                                            <div className="flex flex-col h-full space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-black text-xs">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Objetivo del día</span>
                                                </div>
                                                <h4 className="font-bold text-gray-900 line-clamp-1">{lesson.title}</h4>
                                                <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 w-fit px-3 py-1 rounded-full">
                                                    <Target className="h-3 w-3" />
                                                    Acción Inmediata
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Recent Courses */}
                            <motion.div variants={item} className="lg:col-span-2 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-900">Cursos Recientes</h2>
                                    <button className="text-primary-600 text-sm font-semibold hover:text-primary-700">Ver todos</button>
                                </div>

                                {user?.role === 'CREATOR' && courses.length > 0 ? (
                                    <div className="space-y-4">
                                        {courses.map((course, index) => (
                                            <div
                                                key={course.id || index}
                                                onClick={() => navigate(`/course/${course.id}`)}
                                                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-4 items-center group cursor-pointer"
                                            >
                                                <div className="h-20 w-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                                                    <BookOpen className="h-8 w-8 text-gray-400 group-hover:text-primary-500 transition-colors" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-gray-900 truncate mb-1">{course.title}</h3>
                                                    <p className="text-sm text-gray-500 truncate">{course.description}</p>
                                                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                                                        <span>{course.modules?.length || 0} Módulos</span>
                                                        <span>Creado el {new Date(course.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="p-2 text-gray-400 group-hover:text-primary-600 transition-colors">
                                                    <ChevronRight className="h-6 w-6" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center">
                                        <div className="inline-flex p-4 bg-gray-50 rounded-2xl mb-4 text-gray-400">
                                            <BookOpen className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">No tienes cursos todavía</h3>
                                        <p className="text-gray-500 mb-6 max-w-xs mx-auto text-sm">Empieza creando tu primer curso con ayuda de nuestra IA y genera ingresos pasivos.</p>
                                        <Link
                                            to="/create-course"
                                            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all hover:scale-105"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Crear mi primer curso
                                        </Link>
                                    </div>
                                )}
                            </motion.div>

                            {/* Activity/Sidebar Items */}
                            <motion.div variants={item} className="space-y-8">
                                {/* Coupons Section */}
                                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-gray-900">Cupones Activos</h3>
                                        <button onClick={handleCreateCoupon} className="p-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors">
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {coupons.length > 0 ? (
                                            coupons.map((coupon) => (
                                                <div key={coupon.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                                    <div>
                                                        <span className="text-xs font-black bg-white px-2 py-1 rounded-md border border-gray-100 mr-2">{coupon.code}</span>
                                                        <span className="text-xs font-bold text-gray-600">-{coupon.discount}%</span>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleCoupon(coupon.id, !coupon.active)}
                                                        className={`w-10 h-6 rounded-full transition-colors relative ${coupon.active ? 'bg-green-500' : 'bg-gray-300'}`}
                                                    >
                                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${coupon.active ? 'left-5' : 'left-1'}`}></div>
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-gray-400 text-center py-4 italic">No hay cupones activos</p>
                                        )}
                                    </div>
                                </div>

                                {/* Optimization Tip */}
                                <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-6 rounded-3xl text-white">
                                    <div className="flex gap-4 mb-4">
                                        <div className="p-3 bg-white/10 rounded-2xl h-fit">
                                            <Activity className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">Tip de la IA</h4>
                                            <p className="text-xs text-primary-100 leading-relaxed font-medium">Los cursos con más de 3 módulos prácticos tienen una tasa de finalización un 40% superior.</p>
                                        </div>
                                    </div>
                                    <button className="w-full py-3 bg-white text-primary-700 rounded-xl text-xs font-black hover:bg-gray-50 transition-colors">
                                        Optimizar mis cursos
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Rank Info Modal */}
            <RankInfoModal
                isOpen={showRankModal}
                onClose={() => setShowRankModal(false)}
                currentSales={salesData.salesCount}
            />
        </div>
    );
};

export default Dashboard;
