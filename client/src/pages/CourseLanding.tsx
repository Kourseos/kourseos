import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle2, Sparkles, Clock, ShieldCheck,
    ArrowRight, MessageSquare, Plus, Ticket,
    AlertTriangle, Zap, Rocket, Award, Star
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

interface AdvancedLandingData {
    seoTitle: string;
    hero: {
        h1: string;
        h2: string;
        cta: string;
    };
    painPoints: { title: string; description: string }[];
    benefits: { title: string; desc: string }[];
    faqs: { q: string; a: string }[];
    urgency: string;
}

interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    paymentType: string;
    landingPage: string; // JSON string (fallback)
    advancedLanding?: string; // JSON string (new)
}

const CourseLanding = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [landing, setLanding] = useState<AdvancedLandingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState('');
    const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59 });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/courses/public/${courseId}`);
                const data = await response.json();
                setCourse(data);

                // Priorizar Advanced Landing si existe, si no fallback al original
                if (data.advancedLanding) {
                    setLanding(typeof data.advancedLanding === 'string' ? JSON.parse(data.advancedLanding) : data.advancedLanding);
                } else if (data.landingPage) {
                    // Mapeo básico para compatibilidad si no hay avanzada
                    const old = typeof data.landingPage === 'string' ? JSON.parse(data.landingPage) : data.landingPage;
                    setLanding({
                        seoTitle: data.title,
                        hero: { h1: old.h1, h2: old.h2, cta: '¡Comenzar ahora!' },
                        painPoints: [], // No había en el viejo
                        benefits: old.benefits.map((b: string) => ({ title: b, desc: '' })),
                        faqs: old.faqs,
                        urgency: 'Oferta por tiempo limitado'
                    });
                }
            } catch (error) {
                console.error("Error fetching course:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.s > 0) return { ...prev, s: prev.s - 1 };
                if (prev.m > 0) return { ...prev, m: 59, s: 59 };
                if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleCheckout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/payments/create-checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId, couponCode })
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Error al iniciar checkout:", error);
            alert("Error al conectar con la pasarela de pagos.");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="relative">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="h-20 w-20 border-t-4 border-purple-600 rounded-full" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-600 h-8 w-8" />
            </div>
        </div>
    );

    if (!course || !landing) return <div className="min-h-screen flex items-center justify-center">Curso no encontrado</div>;

    return (
        <div className="min-h-screen bg-[#FDFCFE] text-slate-900 font-sans selection:bg-purple-100 italic-headings">
            {/* SEO Head mimic */}
            {/* <title>{landing.seoTitle}</title> */}

            {/* Sticky Notification Bar */}
            <div className="bg-slate-900 text-white py-4 px-6 sticky top-0 z-50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse" />
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 relative z-10 text-sm font-bold tracking-tight">
                    <span className="flex items-center gap-2">
                        <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                        {landing.urgency}
                    </span>
                    <div className="h-4 w-px bg-white/20 hidden md:block" />
                    <div className="flex gap-4 font-mono text-lg">
                        <span className="bg-white/10 px-2 rounded">{String(timeLeft.h).padStart(2, '0')}h</span>
                        <span className="bg-white/10 px-2 rounded">{String(timeLeft.m).padStart(2, '0')}m</span>
                        <span className="bg-white/10 px-2 rounded">{String(timeLeft.s).padStart(2, '0')}s</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <header className="relative pt-32 pb-44 px-6 overflow-hidden">
                <div className="max-w-6xl mx-auto relative z-10 text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 px-5 py-2 rounded-full text-purple-700 text-xs font-black uppercase tracking-widest shadow-sm"
                    >
                        <Award size={14} /> Masterclass Premium de SkillForge Pro
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter"
                    >
                        {landing.hero.h1}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium"
                    >
                        {landing.hero.h2}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col items-center gap-8 pt-8"
                    >
                        <button
                            onClick={handleCheckout}
                            className="bg-slate-900 text-white px-14 py-7 rounded-3xl text-2xl font-black shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-purple-500/30 transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center gap-4 relative group overflow-hidden"
                        >
                            <span className="relative z-10">{landing.hero.cta}</span>
                            <ArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>

                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                            <ShieldCheck size={14} className="text-green-500" /> Pago 100% Seguro • Acceso Instantáneo
                        </div>
                    </motion.div>
                </div>

                {/* Aesthetic Circles */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-slate-100 rounded-full -z-0 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-slate-100 rounded-full -z-0 pointer-events-none" />
            </header>

            {/* Pain Points Section */}
            <section className="py-32 px-6 bg-slate-900 text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto space-y-20 relative z-10">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">¿Te sientes identificado?</h2>
                        <p className="text-slate-400 text-lg">La mayoría de las personas se estancan aquí:</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {landing.painPoints.map((point, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 space-y-6"
                            >
                                <div className="p-4 bg-red-500/10 rounded-2xl w-fit">
                                    <AlertTriangle className="text-red-400 h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-black">{point.title}</h3>
                                <p className="text-slate-400 font-medium leading-relaxed">{point.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
                {/* Decorative mesh */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
            </section>

            {/* Benefits / Solution Section */}
            <section className="py-40 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <span className="text-purple-600 font-black uppercase text-xs tracking-[0.3em]">Nuestra Solución</span>
                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">Diseñado para tu éxito imparable</h2>
                        </div>

                        <div className="space-y-10">
                            {landing.benefits.map((benefit, i) => (
                                <motion.div key={i} className="flex gap-6 items-start group">
                                    <div className="bg-purple-600 text-white p-2 rounded-xl shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-2xl font-black text-slate-800">{benefit.title}</h4>
                                        <p className="text-slate-500 font-medium">{benefit.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-[4rem] relative overflow-hidden flex items-center justify-center p-12">
                            <Rocket className="w-64 h-64 text-purple-600 animate-bounce" />
                            <div className="absolute bottom-10 left-10 p-8 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white max-w-xs transition-all hover:scale-105">
                                <Star className="text-yellow-400 fill-yellow-400 mb-2" />
                                <p className="text-slate-900 font-black text-xl italic leading-tight">"Este curso cambió por completo mi forma de trabajar."</p>
                                <p className="text-slate-400 text-xs mt-2 font-bold uppercase">— Ana García, Pro User</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section (Floating Card Style) */}
            <section className="py-32 px-6 bg-[#111] text-white">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <h2 className="text-5xl md:text-6xl font-black tracking-tight">Acceso Instantáneo de Por Vida</h2>

                    <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-12 rounded-[4rem] border border-white/10 shadow-3xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600" />

                        <div className="space-y-8 relative z-10">
                            <div className="space-y-2">
                                <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Inversión Única</span>
                                <div className="text-8xl font-black tracking-tighter">
                                    <span className="text-3xl align-top mr-1">{course.currency === 'USD' ? '$' : course.currency}</span>
                                    {course.price}
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full py-7 bg-white text-slate-900 rounded-[2rem] text-2xl font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-4 active:scale-95 translate-y-0 group-hover:-translate-y-2"
                            >
                                ¡Quiero inscribirme ahora!
                                <Rocket className="h-6 w-6" />
                            </button>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/5 mt-8">
                                {[
                                    { icon: Zap, text: 'Acceso de por vida' },
                                    { icon: Award, text: 'Certificado oficial' },
                                    { icon: MessageSquare, text: 'Soporte 24/7' },
                                    { icon: ShieldCheck, text: 'Garantía 30 días' },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <item.icon className="h-4 w-4 text-purple-400" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-40 px-6">
                <div className="max-w-3xl mx-auto space-y-20">
                    <h2 className="text-4xl font-black text-center tracking-tight">Resolvamos tus dudas</h2>
                    <div className="space-y-6">
                        {landing.faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="group bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-purple-200 transition-all shadow-sm hover:shadow-xl cursor-help"
                            >
                                <h4 className="text-xl font-black text-slate-900 mb-4 flex items-center justify-between">
                                    {faq.q}
                                    <div className="p-1 bg-slate-50 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        <Plus size={20} />
                                    </div>
                                </h4>
                                <p className="text-slate-500 leading-relaxed font-medium">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Footer */}
            <footer className="py-32 px-6 border-t border-slate-100 text-center">
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="bg-slate-900 text-white w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-12">
                        <Sparkles size={32} />
                    </div>
                    <h2 className="text-4xl font-black tracking-tight">¿Listo para el siguiente nivel?</h2>
                    <p className="text-slate-400 font-bold">Únete a miles de expertos que ya están escalando sus carreras.</p>
                    <button onClick={handleCheckout} className="text-purple-600 font-black text-xl hover:underline underline-offset-8 decoration-4">
                        Empezar ahora →
                    </button>
                    <div className="pt-20 text-[10px] text-slate-300 font-bold uppercase tracking-[0.5em]">
                        Powered by SkillForge AI • Multi-Tenant SaaS Engine
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CourseLanding;
