import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet, ArrowUpRight, Clock, CheckCircle,
    AlertCircle, DollarSign, Landmark, Send
} from 'lucide-react';

const WalletPage = () => {
    const { token } = useAuth();
    const [balanceData, setBalanceData] = useState<any>(null);
    const [withdrawals, setWithdrawals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRequesting, setIsRequesting] = useState(false);

    // Form state
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('PayPal');
    const [details, setDetails] = useState('');

    const fetchData = async () => {
        try {
            const [balRes, histRes] = await Promise.all([
                fetch('http://localhost:3000/api/withdrawals/balance', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:3000/api/withdrawals/history', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (balRes.ok) setBalanceData(await balRes.json());
            if (histRes.ok) setWithdrawals(await histRes.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (parseFloat(amount) < (balanceData?.minWithdrawal || 20)) return;

        try {
            const response = await fetch('http://localhost:3000/api/withdrawals/request', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: parseFloat(amount), method, details })
            });

            if (response.ok) {
                alert("Solicitud de retiro enviada con éxito.");
                setIsRequesting(false);
                setAmount('');
                setDetails('');
                fetchData();
            } else {
                const err = await response.json();
                alert(err.message || "Error al solicitar retiro");
            }
        } catch (e) { console.error(e); }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-bold">Cargando billetera...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Mi Billetera 💰</h1>
                    <p className="text-gray-500 font-medium">Gestiona tus ingresos y solicita retiros de forma segura.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsRequesting(true)}
                    disabled={balanceData?.availableBalance < balanceData?.minWithdrawal}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg ${balanceData?.availableBalance >= balanceData?.minWithdrawal
                            ? 'bg-gray-900 text-white shadow-gray-900/20'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    <ArrowUpRight size={20} />
                    Solicitar Retiro
                </motion.button>
            </header>

            {/* Main Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-10 text-white relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <Wallet size={48} className="text-purple-400 mb-6" />
                        <p className="text-purple-200 font-bold uppercase tracking-widest text-sm mb-2">Saldo Disponible</p>
                        <h2 className="text-6xl font-black">${balanceData?.availableBalance.toFixed(2)}</h2>
                    </div>
                    <div className="relative z-10 pt-8 border-t border-white/10 flex gap-8">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Ganado como Creador</p>
                            <p className="text-xl font-black text-white">${balanceData?.totalCreatorEarned.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Ganado como Afiliado</p>
                            <p className="text-xl font-black text-white">${balanceData?.totalAffiliateEarned.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm space-y-6">
                    <h3 className="font-black text-gray-900 flex items-center gap-2">
                        <AlertCircle size={20} className="text-orange-500" />
                        Sobre los Retiros
                    </h3>
                    <ul className="space-y-4 text-sm font-medium text-gray-600">
                        <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                            Monto mínimo: <span className="font-black text-gray-900 ml-auto">${balanceData?.minWithdrawal}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                            Procesamiento: <span className="font-black text-gray-900 ml-auto">24-48 horas</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                            Comisión SkillForge: <span className="font-black text-green-600 ml-auto">5%</span>
                        </li>
                    </ul>
                    <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                        <p className="text-xs text-purple-700 font-bold leading-relaxed">
                            Resaltamos ante la competencia con la comisión más baja del mercado para ayudarte a escalar.
                        </p>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="font-black text-xl flex items-center gap-2">
                        <Clock className="text-gray-400" />
                        Historial de Movimientos
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest">
                                <th className="px-8 py-4">Fecha</th>
                                <th className="px-8 py-4">Monto</th>
                                <th className="px-8 py-4">Método</th>
                                <th className="px-8 py-4">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {withdrawals.length > 0 ? withdrawals.map((w: any) => (
                                <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-8 py-6 text-sm font-bold text-gray-500">
                                        {new Date(w.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-6 font-black text-gray-900">
                                        ${w.amount.toFixed(2)}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            {w.method === 'PayPal' ? <Send size={14} /> : <Landmark size={14} />}
                                            {w.method}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${w.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                w.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {w.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-8 py-16 text-center text-gray-400 font-medium">
                                        No se han encontrado registros financieros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Withdrawal Modal */}
            <AnimatePresence>
                {isRequesting && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsRequesting(false)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[3rem] p-10 max-w-lg w-full relative z-10 shadow-2xl"
                        >
                            <h2 className="text-3xl font-black mb-6">Solicitar Retiro</h2>
                            <form onSubmit={handleRequest} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Monto a retirar ($)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="number"
                                            required
                                            min={balanceData?.minWithdrawal}
                                            max={balanceData?.availableBalance}
                                            step="0.01"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none text-xl font-black outline-none focus:ring-2 focus:ring-purple-100"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <p className="mt-2 text-[10px] text-gray-400 font-bold">Mínimo: ${balanceData?.minWithdrawal} | Máximo: ${balanceData?.availableBalance.toFixed(2)}</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Método de Pago</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['PayPal', 'Transferencia'].map(m => (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => setMethod(m)}
                                                className={`py-4 rounded-2xl font-black transition-all border-2 ${method === m ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-100 text-gray-400 hover:border-gray-200'
                                                    }`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Detalles de Destino</label>
                                    <input
                                        type="text"
                                        required
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-purple-100"
                                        placeholder={method === 'PayPal' ? 'Email de tu cuenta PayPal' : 'CBU o detalles de cuenta'}
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsRequesting(false)}
                                        className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black hover:bg-gray-200"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-gray-800 shadow-xl shadow-gray-900/20"
                                    >
                                        Confirmar Retiro
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WalletPage;
