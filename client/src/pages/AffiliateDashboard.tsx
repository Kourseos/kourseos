import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
    Users, Link as LinkIcon, DollarSign, TrendingUp,
    MousePointer2, Copy, CheckCircle, ExternalLink,
    Activity
} from 'lucide-react';

const AffiliateDashboard = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState<any>({ links: [], totalCommission: 0, totalSales: 0, sales: [] });
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/affiliates/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/courses', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
            }
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        if (token) {
            fetchStats();
            fetchCourses();
        }
    }, [token]);

    const handleCreateLink = async (courseId: string) => {
        const rate = prompt("Porcentaje de comisión deseado (ej: 20):", "20");
        if (!rate) return;

        try {
            const response = await fetch('http://localhost:3000/api/affiliates/links', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ courseId, commissionRate: parseFloat(rate) })
            });
            if (response.ok) fetchStats();
        } catch (e) { console.error(e); }
    };

    const copyToClipboard = (code: string) => {
        const url = `${window.location.origin}/landing/${stats.links.find((l: any) => l.code === code).courseId}?aff=${code}`;
        navigator.clipboard.writeText(url);
        setCopied(code);
        setTimeout(() => setCopied(null), 2000);
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-bold">Cargando datos de afiliado...</div>;

    const cards = [
        { label: 'Comisión Total', value: `$${stats.totalCommission.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Ventas Generadas', value: stats.totalSales, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Enlaces Activos', value: stats.links.length, icon: LinkIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Clics Totales', value: stats.links.reduce((acc: number, l: any) => acc + l.clicks, 0), icon: MousePointer2, color: 'text-orange-600', bg: 'bg-orange-50' }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-black text-gray-900 mb-2 font-sans italic">Programa de Afiliados 🚀</h1>
                <p className="text-gray-500 font-medium">Gestiona tus enlaces y monetiza tu red recomendando cursos.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm"
                    >
                        <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-4`}>
                            <card.icon size={24} />
                        </div>
                        <p className="text-sm font-bold text-gray-500 mb-1">{card.label}</p>
                        <p className="text-2xl font-black text-gray-900">{card.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Links */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <LinkIcon size={20} className="text-primary-600" />
                        Tus Enlaces de Afiliado
                    </h2>
                    <div className="grid gap-4">
                        {stats.links.map((link: any) => (
                            <div key={link.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">{link.course.title}</h3>
                                    <p className="text-xs text-green-600 font-black uppercase tracking-widest">{link.commissionRate}% de Comisión</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-50 px-4 py-2 rounded-xl text-sm font-mono text-gray-600 border border-gray-100">
                                        {link.code}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(link.code)}
                                        className="p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all active:scale-90"
                                    >
                                        {copied === link.code ? <CheckCircle size={20} className="text-green-400" /> : <Copy size={20} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Available Courses to Affiliate */}
                    <div className="pt-8">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Plus size={20} className="text-primary-600" />
                            Cursos Disponibles para Afiliación
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {courses.filter(c => !stats.links.some((l: any) => l.courseId === c.id)).map(course => (
                                <div key={course.id} className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-300 flex justify-between items-center">
                                    <span className="font-bold text-gray-700">{course.title}</span>
                                    <button
                                        onClick={() => handleCreateLink(course.id)}
                                        className="text-xs bg-primary-600 text-white px-4 py-2 rounded-xl font-black hover:bg-primary-700 transition-colors"
                                    >
                                        Ser Afiliado
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Affiliate Sales */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                        <Activity size={20} className="text-primary-600" />
                        Ventas Recientes
                    </h2>
                    <div className="bg-white rounded-3xl border border-gray-100 divide-y divide-gray-50 overflow-hidden shadow-sm">
                        {stats.sales.length > 0 ? stats.sales.map((sale: any) => (
                            <div key={sale.id} className="p-4">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-1">{new Date(sale.createdAt).toLocaleDateString()}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-800 line-clamp-1">{sale.studentEmail}</span>
                                    <span className="text-sm font-black text-green-600">+${sale.commission.toFixed(2)}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="p-12 text-center text-gray-400 text-sm">Aún no has generado comisiones. ¡Comparte tus links!</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AffiliateDashboard;
