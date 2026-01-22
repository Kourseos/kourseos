import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Mail, Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Credenciales inválidas. Por favor intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Form */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-[600px] xl:w-[700px] bg-white relative z-10"
            >
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-10">
                        <Link to="/" className="flex items-center gap-2 group mb-8">
                            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                                SkillForge AI
                            </span>
                        </Link>
                        <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
                            Bienvenido de nuevo
                        </h2>
                        <p className="text-gray-500 text-lg">
                            Ingresa a tu espacio de creación
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700"
                            >
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    placeholder="nombre@empresa.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-sm font-semibold text-gray-700">Contraseña</label>
                                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="block w-full pl-11 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Iniciar Sesión
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">¿No tienes cuenta?</span>
                            </div>
                        </div>
                        <div className="mt-6 text-center space-y-4">
                            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                                Comienza tu prueba gratuita de 14 días
                            </Link>

                            <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-left">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Cuentas de Acceso Rápido (Demo)</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => { setEmail('admin@skillforge.ai'); setPassword('admin'); }}
                                        className="text-[11px] font-bold text-gray-600 hover:text-primary-600 flex items-center gap-1"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> Creator Account
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setEmail('student@skillforge.ai'); setPassword('student'); }}
                                        className="text-[11px] font-bold text-gray-600 hover:text-primary-600 flex items-center gap-1"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Student Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right Side - Artistic Background */}
            <div className="hidden lg:block relative flex-1 bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-secondary-800/90 mix-blend-multiply z-10" />
                <img
                    className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale mix-blend-overlay"
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
                    alt="Team working"
                />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-20"></div>

                {/* Floating Elements */}
                <div className="absolute inset-0 z-30 flex items-center justify-center p-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="max-w-lg"
                    >
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                                    <CheckCircle2 className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-xl">Generación Exitosa</h3>
                                    <p className="text-white/70 text-sm">Tu curso de Python Avanzado está listo</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-2 bg-white/20 rounded-full w-3/4 animate-pulse"></div>
                                <div className="h-2 bg-white/20 rounded-full w-full animate-pulse delay-75"></div>
                                <div className="h-2 bg-white/20 rounded-full w-5/6 animate-pulse delay-150"></div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h2 className="text-4xl font-black text-white mb-6 leading-tight">
                                Transforma tu conocimiento en <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">experiencias educativas</span>
                            </h2>
                            <p className="text-lg text-white/80 leading-relaxed">
                                Únete a más de 10,000 creadores que están revolucionando la educación online con el poder de la Inteligencia Artificial.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
