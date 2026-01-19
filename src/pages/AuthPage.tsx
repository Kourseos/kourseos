import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Mail, Lock, ArrowRight, Github, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Redirección si ya hay sesión activa
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) navigate('/');
        };
        checkUser();
    }, [navigate]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                navigate('/');
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: window.location.origin,
                    }
                });
                if (error) throw error;
                alert('Registro iniciado. Por favor revisa tu email para confirmar tu cuenta y poder loguearte.');
                setIsLogin(true); // Cambiar a login tras registro exitoso
            }
        } catch (err: any) {
            setError(err.message || 'Error en la autenticación');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'github' | 'google') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: { redirectTo: window.location.origin }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 mb-4">
                        <BookOpen className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        KourseOS
                        <span className="badge-founder text-[10px]">v1.0</span>
                    </h1>
                    <p className="text-text-muted text-sm mt-2 text-center max-w-[280px]">
                        El Sistema Operativo para la Nueva Era de la Educación.
                    </p>
                </div>

                {/* Auth Card */}
                <div className="surface-card p-8 border-white/10 shadow-2xl shadow-black/50">
                    <div className="flex gap-4 mb-8 p-1 bg-background rounded-xl border border-white/5">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${isLogin ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text'
                                }`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${!isLogin ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form className="space-y-5" onSubmit={handleAuth}>
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    type="email"
                                    required
                                    placeholder="nombre@empresa.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-background border border-white/10 rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Password</label>
                                {isLogin && <button type="button" className="text-[10px] text-primary hover:underline font-bold uppercase">Olvidé mi clave</button>}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3.5 bg-background border border-white/10 rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full btn-primary py-4 mt-2 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Acceder al Dashboard' : 'Crear Cuenta KourseOS'}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest text-text-muted">
                            <span className="bg-[#161B2B] px-4 font-bold">O continuar con</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <button onClick={() => handleSocialLogin('github')} className="flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-sm font-medium">
                            <Github size={18} />
                            GitHub
                        </button>
                        <button onClick={() => handleSocialLogin('google')} className="flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-sm font-medium">
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 grayscale opacity-70" />
                            Google
                        </button>
                    </div>
                </div>

                {/* Footer Info */}
                <p className="text-center text-text-muted text-xs mt-8 flex items-center justify-center gap-2 opacity-60">
                    <Sparkles size={12} className="text-primary" />
                    Infraestructura Segura con Supabase Auth
                </p>
            </motion.div>
        </div>
    );
};

export default AuthPage;
