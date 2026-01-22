import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Sparkles, Zap, ShieldCheck, X } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

interface GatedContentModalProps {
    courseId: string;
    creatorId: string;
    onUnlock: (email: string) => void;
    onClose: () => void;
}

const GatedContentModal = ({ courseId, creatorId, onUnlock, onClose }: GatedContentModalProps) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/supabase/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, courseId, creatorId })
            });

            if (response.ok) {
                localStorage.setItem(`lead_${courseId}`, email);
                onUnlock(email);
            } else {
                setError('Hubo un problema al procesar tu solicitud.');
            }
        } catch (err) {
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white rounded-[3rem] shadow-3xl w-full max-w-lg overflow-hidden border border-gray-100"
            >
                {/* Header Graphic */}
                <div className="h-40 bg-gradient-to-br from-purple-600 to-indigo-700 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                    </div>
                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-3xl border border-white/30 rotate-12 shadow-2xl">
                            <Lock className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    {/* Animated particles */}
                    <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-purple-300 rounded-full animate-ping"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-pink-300 rounded-full animate-pulse delay-1000"></div>
                </div>

                <div className="p-10 space-y-8">
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full text-purple-600 font-black text-[10px] tracking-widest uppercase">
                            <Sparkles size={12} /> Desbloqueo Exclusivo
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 leading-tight">Accede a la Masterclass Gratuita</h2>
                        <p className="text-gray-500 font-medium px-4">
                            Ingresa tu correo para desbloquear la <span className="text-purple-600 font-bold">Lección 1</span> y recibir asistencia de nuestro <span className="text-gray-900 font-bold underline decoration-purple-400">Tutor de IA</span>.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-purple-600 rounded-2xl text-gray-900 placeholder-gray-400 font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all shadow-inner"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Obtener acceso inmediato</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {error && (
                        <p className="text-center text-red-500 text-sm font-bold">{error}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                            <Zap size={14} className="text-yellow-400 fill-yellow-400" /> IA Tutor Activo
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-wider text-right justify-end">
                            <ShieldCheck size={14} className="text-green-500" /> Sin spam, nunca.
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-xl text-white backdrop-blur-md transition-all"
                >
                    <X size={20} />
                </button>
            </motion.div>
        </div>
    );
};

export default GatedContentModal;
