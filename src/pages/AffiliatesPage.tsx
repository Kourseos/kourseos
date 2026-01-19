import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    TrendingUp,
    DollarSign,
    Link as LinkIcon,
    Copy,
    CheckCircle2,
    ChevronRight,
    UserPlus,
    ArrowUpRight,
    Wallet
} from 'lucide-react';

const stats = [
    { label: 'Afiliados Totales', value: '42', change: '+12%', icon: Users },
    { label: 'Conversión de Leads', value: '8.5%', change: '+2.1%', icon: TrendingUp },
    { label: 'Comisiones Pagadas', value: '$2,840', change: '+15%', icon: DollarSign },
    { label: 'Balance Pendiente', value: '$450', change: '', icon: Wallet },
];

const recentReferrals = [
    { name: 'Maria Garcia', date: 'Hoy, 10:30', course: 'Machine Learning para Creadores', commission: '$45.00', status: 'pending' },
    { name: 'Juan Perez', date: 'Ayer, 18:45', course: 'Audio Marketing Automation', commission: '$12.00', status: 'paid' },
    { name: 'Laura Smith', date: 'Hace 2 días', course: 'Machine Learning para Creadores', commission: '$45.00', status: 'paid' },
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

const AffiliatesPage = () => {
    const [copied, setCopied] = useState(false);
    const referralLink = 'https://kourseos.ai/ref/seba_founder';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-white/5 bg-gradient-to-br from-primary/5 to-background px-10 py-12"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-text mb-2">Marketing de Afiliados</h1>
                            <p className="text-base text-text-muted max-w-2xl leading-relaxed">
                                Gestiona tu red de crecimiento, configura comisiones y monitorea el rendimiento de tus socios comerciales.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-text font-medium transition-all border border-white/10">
                                Configurar Reglas
                            </button>
                            <button className="btn-primary flex items-center gap-2">
                                <UserPlus size={18} />
                                Invitar Afiliado
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="p-10 max-w-7xl mx-auto space-y-10"
            >
                {/* Referral Link Card */}
                <section>
                    <div className="surface-card bg-gradient-to-r from-primary/10 via-transparent to-transparent border-primary/20">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                                    <LinkIcon className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-text">Tu Link Global de Creador</h3>
                                    <p className="text-sm text-text-muted">Usa este link para referir estudiantes a cualquier curso de tu infraestructura.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <div className="bg-background border border-white/10 px-4 py-3 rounded-xl flex-1 md:w-80 text-sm font-mono text-primary truncate">
                                    {referralLink}
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                >
                                    {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <motion.div variants={itemVariants} key={stat.label} className="surface-card">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                                    <stat.icon className="text-primary" size={20} />
                                </div>
                                {stat.change && (
                                    <span className="text-xs font-bold text-emerald-400">{stat.change}</span>
                                )}
                            </div>
                            <p className="text-3xl font-bold text-text mb-1">{stat.value}</p>
                            <p className="text-sm text-text-muted font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main List: Recent Activity */}
                    <section className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-text">Actividad Reciente</h3>
                            <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                                Ver Historial <ChevronRight size={14} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentReferrals.map((item, idx) => (
                                <motion.div variants={itemVariants} key={idx} className="surface-card flex items-center justify-between group hover:border-primary/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center border border-white/5">
                                            <Users className="text-gray-500" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-text font-medium">{item.name}</h4>
                                            <p className="text-xs text-text-muted">{item.course} · {item.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-text">+{item.commission}</p>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${item.status === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <ArrowUpRight className="text-gray-600 group-hover:text-primary transition-colors" size={18} />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Quick Config Card */}
                    <section className="space-y-6">
                        <h3 className="text-lg font-semibold text-text">Configuración de Red</h3>
                        <div className="surface-card space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-3">Comisión Base (%)</label>
                                <div className="flex items-center gap-4">
                                    <input type="range" className="flex-1 accent-primary" min="10" max="70" defaultValue="30" />
                                    <span className="text-lg font-bold text-text">30%</span>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-white/5">
                                <h4 className="text-sm font-semibold text-text mb-4">Payouts Automáticos</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-white/5">
                                        <span className="text-xs text-text/80">Pago Mínimo</span>
                                        <span className="text-xs font-bold text-text">$50.00</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-white/5">
                                        <span className="text-xs text-text/80">Ciclo de Pago</span>
                                        <span className="text-xs font-bold text-text">Mensual</span>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full py-3 bg-primary rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                Guardar Cambios
                            </button>
                        </div>
                    </section>
                </div>
            </motion.main>
        </div>
    );
};

export default AffiliatesPage;
