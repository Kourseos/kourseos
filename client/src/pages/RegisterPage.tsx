import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Mail, Lock, User, Briefcase, GraduationCap, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await register(name, email, password, role as 'CREATOR' | 'STUDENT');
            navigate('/dashboard');
        } catch (err) {
            setError('Error al crear la cuenta. Intenta nuevamente.');
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
                    <div className="mb-8">
                        <Link to="/" className="flex items-center gap-2 group mb-8">
                            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                                SkillForge AI
                            </span>
                        </Link>
                        <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
                            Crea tu cuenta
                        </h2>
                        <p className="text-gray-500 text-lg">
                            Comienza tu viaje de aprendizaje hoy
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                            <label className="text-sm font-semibold text-gray-700 ml-1">Nombre Completo</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    placeholder="Juan Pérez"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    placeholder="juan@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Contraseña</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Quiero ser:</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('STUDENT')}
                                    className={`relative flex flex-col items-center p-4 border-2 rounded-xl transition-all ${role === 'STUDENT'
                                            ? 'border-primary-500 bg-primary-50/50 text-primary-700'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                        }`}
                                >
                                    <GraduationCap className={`h-6 w-6 mb-2 ${role === 'STUDENT' ? 'text-primary-600' : 'text-gray-400'}`} />
                                    <span className="font-semibold text-sm">Estudiante</span>
                                    {role === 'STUDENT' && (
                                        <motion.div layoutId="role-check" className="absolute top-2 right-2 h-2 w-2 bg-primary-500 rounded-full" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('CREATOR')}
                                    className={`relative flex flex-col items-center p-4 border-2 rounded-xl transition-all ${role === 'CREATOR'
                                            ? 'border-primary-500 bg-primary-50/50 text-primary-700'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                        }`}
                                >
                                    <Briefcase className={`h-6 w-6 mb-2 ${role === 'CREATOR' ? 'text-primary-600' : 'text-gray-400'}`} />
                                    <span className="font-semibold text-sm">Creador</span>
                                    {role === 'CREATOR' && (
                                        <motion.div layoutId="role-check" className="absolute top-2 right-2 h-2 w-2 bg-primary-500 rounded-full" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Crear Cuenta
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            ¿Ya tienes una cuenta?{' '}
                            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Right Side - Artistic Background */}
            <div className="hidden lg:block relative flex-1 bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-bl from-secondary-600/90 to-primary-800/90 mix-blend-multiply z-10" />
                <img
                    className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale mix-blend-overlay"
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
                    alt="Learning online"
                />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-20"></div>

                {/* Floating Elements */}
                <div className="absolute inset-0 z-30 flex items-center justify-center p-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="max-w-lg text-center"
                    >
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-8">
                            <Sparkles className="h-4 w-4 text-yellow-300" />
                            <span className="text-sm font-medium text-white">Únete a la revolución educativa</span>
                        </div>

                        <h2 className="text-5xl font-black text-white mb-6 leading-tight tracking-tight">
                            El futuro del aprendizaje es <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">personalizado</span>
                        </h2>

                        <div className="grid grid-cols-2 gap-4 mt-12">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left">
                                <div className="text-3xl font-bold text-white mb-1">10k+</div>
                                <div className="text-white/60 text-sm">Cursos Generados</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left">
                                <div className="text-3xl font-bold text-white mb-1">1M+</div>
                                <div className="text-white/60 text-sm">Lecciones Completadas</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
