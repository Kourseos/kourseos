import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, DollarSign, X, CheckCircle2, Zap } from 'lucide-react';

interface RankInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentSales: number;
}

const RankInfoModal = ({ isOpen, onClose, currentSales }: RankInfoModalProps) => {
    const ranks = [
        { name: 'Bronce', sales: 0, fee: 5, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { name: 'Plata', sales: 50, fee: 4, color: 'text-gray-400', bg: 'bg-gray-400/10' },
        { name: 'Oro', sales: 200, fee: 3, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        <div className="absolute top-6 right-6">
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="h-6 w-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-primary-50 rounded-2xl">
                                    <TrendingUp className="h-8 w-8 text-primary-600" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Escalabilidad Pro</h2>
                                    <p className="text-gray-500 font-medium">Mientras más vendes, más ganas.</p>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-10 leading-relaxed">
                                En SkillForge premiamos tu crecimiento. Nuestra estructura de comisiones por volumen está diseñada para que, al escalar tu negocio, el costo de infraestructura disminuya automáticamente.
                            </p>

                            <div className="space-y-4">
                                {ranks.map((rank, index) => {
                                    const isAchieved = currentSales >= rank.sales;
                                    return (
                                        <div
                                            key={index}
                                            className={`p-6 rounded-3xl border transition-all ${isAchieved ? 'border-green-100 bg-green-50/30' : 'border-gray-100 bg-gray-50/30'}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-xl ${rank.bg}`}>
                                                        <Shield className={`h-6 w-6 ${rank.color}`} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-gray-900 text-lg">Nivel {rank.name}</h4>
                                                        <p className="text-sm font-bold text-gray-400">{rank.sales === 0 ? 'Nivel Inicial' : `Más de ${rank.sales} ventas`}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-2 text-primary-600 font-black text-2xl">
                                                        <span>{rank.fee}%</span>
                                                        <DollarSign className="h-5 w-5" />
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Comisión</p>
                                                </div>
                                            </div>
                                            {isAchieved && (
                                                <div className="mt-4 flex items-center gap-2 text-green-600 text-xs font-black uppercase tracking-widest">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Beneficio Activado
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-10 p-6 bg-gray-900 rounded-[1.8rem] text-white flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Zap className="h-6 w-6 text-yellow-400" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-400">Total Ventas Actuales</p>
                                        <p className="text-xl font-black">{currentSales} Ventas</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 bg-white text-black rounded-xl font-black hover:scale-105 transition-transform"
                                >
                                    ¡Vamos por más!
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RankInfoModal;
