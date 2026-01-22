import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';
import {
    Check, Zap, Award, Sparkles,
    ArrowRight, Star, Shield, Rocket, BarChart3,
    Globe, Cpu, MessageSquare, Video
} from 'lucide-react';
import { BRAND_NAME, BRAND_SUBTITLE, BRAND_TAGLINE } from '../constants/brand';

const LandingPage = () => {
    const { t } = useTranslation();
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    const stagger = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const plans = [
        {
            name: 'Essential',
            price: '29',
            duration: '/mes',
            tagline: 'Para creadores independientes',
            description: 'Todo lo necesario para validar y escalar tu conocimiento.',
            features: [
                '5 cursos activos',
                'Hasta 500 estudiantes',
                'Tutor IA Avanzado 24/7',
                'Quizzes automáticos',
                'Certificados personalizados',
                'Análisis de rendimiento',
                'Soporte prioritario'
            ],
            cta: 'Comenzar Ahora',
            popular: false,
            gradient: 'from-blue-600 to-indigo-600',
            icon: Rocket
        },
        {
            name: 'Professional',
            price: '79',
            duration: '/mes',
            tagline: 'Nuestra opción más elegida',
            description: 'Potencia tu academia con IA de última generación y escala sin límites.',
            features: [
                '20 cursos activos',
                'Estudiantes ilimitados',
                'IA Pro con RAG (Contexto)',
                'Generación de Video IA',
                'Certidificados Blockchain',
                'Analytics Pro + BI',
                'API & Webhooks',
                'Soporte VIP 24/7'
            ],
            cta: 'Obtener Pro',
            popular: true,
            gradient: 'from-purple-600 to-pink-600',
            icon: Zap
        },
        {
            name: 'Enterprise',
            price: '149',
            duration: '/mes',
            tagline: 'Para equipos y organizaciones',
            description: 'Control total, marca blanca y personalización corporativa completa.',
            features: [
                'Cursos ilimitados',
                'White-label (Marca propia)',
                'IA Personalizada 100%',
                '10 usuarios de equipo',
                'Multi-tenant SSO',
                'Soporte Enterprise',
                'Account Manager dedicado',
                'Acuerdos de nivel de servicio'
            ],
            cta: 'Contáctanos',
            popular: false,
            gradient: 'from-slate-800 to-gray-900',
            icon: Shield
        }
    ];

    const features = [
        {
            icon: Cpu,
            title: 'IA Generativa de Última Generación',
            description: 'Powered by Gemini 2.0 Flash. Genera currículos completos, quizzes y evaluaciones en segundos con precisión de nivel PhD.',
            gradient: 'from-purple-500 to-indigo-600'
        },
        {
            icon: MessageSquare,
            title: 'Tutor IA 24/7 Contextual',
            description: 'Cada estudiante tiene un tutor personal que responde basado en el contenido específico de tu curso. Nunca más "el profesor no responde".',
            gradient: 'from-blue-500 to-cyan-600'
        },
        {
            icon: BarChart3,
            title: 'Optimización Continua Automática',
            description: 'La IA analiza patrones de confusión, preguntas frecuentes y métricas de completación para sugerir mejoras automáticas.',
            gradient: 'from-green-500 to-emerald-600'
        },
        {
            icon: Shield,
            title: 'Certificados Blockchain Verificables',
            description: 'Emite certificados que no pueden falsificarse. Tus estudiantes pueden compartir credenciales verificables en LinkedIn.',
            gradient: 'from-amber-500 to-orange-600'
        },
        {
            icon: Globe,
            title: 'Multi-idioma Instantáneo',
            description: 'Tu contenido traducido automáticamente a 50+ idiomas sin perder contexto ni calidad. Alcance global en un click.',
            gradient: 'from-pink-500 to-rose-600'
        },
        {
            icon: Video,
            title: 'Generación de Video con IA',
            description: 'Convierte tus lecciones de texto en videos profesionales con avatares IA. Sin cámara, sin edición, sin equipos costosos.',
            gradient: 'from-violet-500 to-purple-600'
        }
    ];

    const stats = [
        { value: '10,000+', label: 'Creadores Activos' },
        { value: '500K+', label: 'Estudiantes' },
        { value: '98%', label: 'Satisfacción' },
        { value: '24/7', label: 'Soporte IA' }
    ];

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
                className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
                                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-primary-900 to-pink-900 bg-clip-text text-transparent">
                                {BRAND_NAME}
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                                Características
                            </a>
                            <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                                Precios
                            </a>
                            <a href="#testimonials" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                                Casos de Éxito
                            </a>
                            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                                {t('nav.login')}
                            </Link>
                            <Link to="/register" className="btn-primary flex items-center gap-2">
                                {t('nav.register')}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <div className="ml-4 pl-4 border-l border-gray-100">
                                <LanguageSelector />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        variants={stagger}
                        initial="initial"
                        animate="animate"
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-full px-6 py-2 mb-8">
                            <Star className="h-4 w-4 text-purple-600 fill-purple-600" />
                            <span className="text-sm font-semibold text-purple-900 uppercase tracking-wider">
                                {t('hero.badge')}
                            </span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
                            <span className="bg-gradient-to-r from-gray-900 via-primary-900 to-gray-900 bg-clip-text text-transparent">
                                Domina el futuro con
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-primary-600 via-pink-600 to-orange-600 bg-clip-text text-transparent animate-gradient">
                                {BRAND_NAME}
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
                            {BRAND_SUBTITLE}. Producimos cursos de Nano Learning diseñados para aprender habilidades complejas en 5 minutos.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to="/register" className="group relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
                                <button className="relative px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl hover:scale-105 transition-all shadow-2xl flex items-center gap-3">
                                    {t('hero.cta_primary')}
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <button className="px-10 py-5 bg-white border-2 border-gray-200 text-gray-900 text-lg font-semibold rounded-2xl hover:border-purple-600 hover:text-purple-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-3">
                                <Video className="h-5 w-5" />
                                {t('hero.cta_secondary')}
                            </button>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="mt-16 flex flex-wrap justify-center gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 bg-gradient-to-b from-gray-50 to-white px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-full px-6 py-2 mb-6">
                            <Zap className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-semibold text-purple-900">
                                Tecnología de Vanguardia
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black mb-6">
                            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Features que Ninguna
                                <br />
                                Otra Plataforma Tiene
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            No somos otra plataforma de cursos. Somos el futuro de la educación online.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative"
                            >
                                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition duration-300 blur rounded-3xl`}></div>
                                <div className="relative card p-8 h-full">
                                    <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-gray-900">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="pricing" className="py-32 px-4 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-purple-100 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-100 rounded-full blur-3xl opacity-30"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-6 py-2 mb-6 shadow-sm">
                            <Rocket className="h-4 w-4 text-primary-600" />
                            <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                                Servicios y Membresías
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black mb-8">
                            <span className="bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">
                                Elige el Plan para
                                <br />
                                tu Próximo Nivel
                            </span>
                        </h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                            Soluciones escalables para creadores, profesionales y organizaciones que buscan dominar el Nano Learning.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative group ${plan.popular ? 'lg:-mt-8 z-20' : 'z-10'}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-30">
                                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-2 rounded-full text-xs font-black shadow-2xl flex items-center gap-2 tracking-widest uppercase">
                                            <Star className="h-4 w-4 fill-white animate-pulse" />
                                            Recomendado
                                        </div>
                                    </div>
                                )}

                                <div className={`h-full p-10 rounded-[3rem] transition-all duration-500 ${plan.popular
                                    ? 'bg-white border-2 border-purple-500 shadow-[0_40px_100px_rgba(147,51,234,0.15)] scale-105'
                                    : 'bg-white/70 backdrop-blur-xl border border-gray-100 hover:border-purple-200 hover:shadow-2xl shadow-sm'
                                    }`}>
                                    <div className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:rotate-6 transition-transform`}>
                                        <plan.icon className="h-8 w-8 text-white" />
                                    </div>

                                    <div className="mb-10">
                                        <h3 className="text-3xl font-black text-gray-900 mb-2">{plan.name}</h3>
                                        <p className="text-sm text-purple-600 font-black uppercase tracking-widest mb-4 group-hover:translate-x-1 transition-transform inline-block">
                                            {plan.tagline}
                                        </p>
                                        <div className="flex items-baseline mb-4">
                                            <span className="text-1xl font-bold text-gray-400 mr-2">$</span>
                                            <span className="text-6xl font-black text-gray-900 tracking-tighter">
                                                {plan.price}
                                            </span>
                                            <span className="ml-2 text-gray-400 font-bold">{plan.duration}</span>
                                        </div>
                                        <p className="text-gray-500 font-medium leading-relaxed">{plan.description}</p>
                                    </div>

                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent mb-10"></div>

                                    <ul className="space-y-5 mb-12">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-4 group/item">
                                                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${plan.popular ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400 group-hover/item:bg-purple-50 group-hover/item:text-purple-500'}`}>
                                                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                                </div>
                                                <span className="text-sm text-gray-600 font-medium group-hover/item:text-gray-900 transition-colors">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        to="/register"
                                        className={`block w-full py-6 px-8 rounded-[2rem] font-black text-center text-lg transition-all duration-300 ${plan.popular
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_20px_40px_rgba(147,51,234,0.3)] hover:scale-[1.03] hover:shadow-[0_25px_50px_rgba(147,51,234,0.4)]'
                                            : 'bg-gray-900 text-white hover:bg-black hover:scale-[1.02]'
                                            }`}
                                    >
                                        {plan.cta}
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="text-center mt-20"
                    >
                        <p className="text-gray-500 font-medium mb-4 italic">¿Necesitas algo más potente?</p>
                        <button className="bg-white border border-gray-200 px-8 py-4 rounded-2xl text-gray-900 font-bold hover:border-purple-500 hover:text-purple-600 transition-all shadow-sm flex items-center gap-3 mx-auto">
                            Personalizar Solución Enterprise
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-32 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Award className="h-20 w-20 mx-auto mb-8 text-white" />
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
                            Únete a la Revolución
                            <br />
                            de la Educación
                        </h2>
                        <p className="text-2xl text-white/90 mb-12 leading-relaxed">
                            Miles de creadores ya están transformando vidas con SkillForge AI.
                            <br />
                            <span className="font-bold">Es tu turno.</span>
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-3 bg-white text-purple-900 px-12 py-6 rounded-2xl text-xl font-black hover:scale-105 transition-all shadow-2xl"
                        >
                            Comenzar Ahora - Gratis
                            <ArrowRight className="h-6 w-6" />
                        </Link>
                        <p className="text-white/80 mt-6 text-sm">
                            No se requiere tarjeta de crédito • Cancela cuando quieras
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold">{BRAND_NAME}</span>
                        </div>
                        <p className="text-gray-400 max-w-2xl mb-8">
                            {BRAND_TAGLINE} La plataforma líder en Nano Learning impulsada por inteligencia artificial.
                        </p>
                        <div className="flex gap-6 mb-8">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Términos</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidad</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a>
                        </div>
                        <p className="text-gray-500 text-sm">
                            © 2025 SkillForge AI. Transformando la educación con inteligencia artificial.
                        </p>
                    </div>
                </div>
            </footer>


        </div>
    );
};

export default LandingPage;
