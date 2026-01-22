import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Key, Plus, Trash2, Copy, CheckCircle2,
    Shield, Globe, Code2, AlertTriangle,
    ArrowLeft, Loader2, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

interface ApiKey {
    id: string;
    key: string;
    name: string;
    createdAt: string;
    lastUsed: string | null;
}

const DevelopersPage = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const fetchKeys = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/keys`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setKeys(data);
            }
        } catch (error) {
            console.error('Failed to fetch keys:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchKeys();
    }, [token]);

    const handleCreateKey = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKeyName.trim() || creating) return;

        setCreating(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/keys`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: newKeyName })
            });
            if (response.ok) {
                setNewKeyName('');
                fetchKeys();
            }
        } catch (error) {
            console.error('Failed to create key:', error);
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteKey = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta clave? Las integraciones conectadas dejarán de funcionar.')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/keys/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setKeys(keys.filter(k => k.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete key:', error);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(text);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-black selection:text-white">
            <header className="bg-white/70 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2.5 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-500" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-gray-900 leading-none mb-1">Developer Portal</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">API & Integrations</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Intro Section */}
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Potencia tus cursos</h2>
                            <p className="text-gray-500 leading-relaxed font-medium">
                                Usa nuestras APIs públicas para conectar SkillForge AI con tu propio sitio web, CRM o aplicaciones móviles.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <div className="p-2 bg-blue-50 rounded-xl">
                                    <Globe className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900">Endpoints Públicos</h4>
                                    <p className="text-xs text-gray-500">Cursos, Inscripciones y Progreso</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <div className="p-2 bg-purple-50 rounded-xl">
                                    <Shield className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900">Seguridad Total</h4>
                                    <p className="text-xs text-gray-500">Claves firmadas y autenticación SK</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <div className="p-2 bg-green-50 rounded-xl">
                                    <Code2 className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900">Documentación</h4>
                                    <p className="text-xs text-gray-500">Swagger & Postman (Próximamente)</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-900 rounded-[2rem] text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <h4 className="text-sm font-black mb-2 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-400" />
                                Nota de Seguridad
                            </h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Nunca compartas tus "Secret Keys". Expón estas claves solo en entornos seguros del lado del servidor.
                            </p>
                        </div>
                    </div>

                    {/* Keys Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-xl shadow-gray-200/50">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-1">Tus API Keys</h3>
                                    <p className="text-sm text-gray-500 font-medium">Claves activas para tus integraciones.</p>
                                </div>

                                <form onSubmit={handleCreateKey} className="flex gap-2 w-full md:w-auto">
                                    <input
                                        type="text"
                                        value={newKeyName}
                                        onChange={(e) => setNewKeyName(e.target.value)}
                                        placeholder="Nombre (ej: Mobile App)"
                                        className="flex-1 md:w-48 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gray-900/5 focus:bg-white transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-900/10 disabled:opacity-50"
                                    >
                                        {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                        Crear
                                    </button>
                                </form>
                            </div>

                            {loading ? (
                                <div className="py-20 flex justify-center">
                                    <Loader2 className="h-10 w-10 text-gray-200 animate-spin" />
                                </div>
                            ) : keys.length === 0 ? (
                                <div className="py-20 text-center space-y-4">
                                    <div className="p-6 bg-gray-50 rounded-[2rem] inline-block">
                                        <Key className="h-12 w-12 text-gray-300" />
                                    </div>
                                    <p className="text-gray-400 font-bold">No tienes API Keys generadas aún.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {keys.map((key) => (
                                        <motion.div
                                            key={key.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="group p-6 bg-gray-50/50 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-black text-gray-900 mb-1 flex items-center gap-2">
                                                        {key.name}
                                                        <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md uppercase tracking-widest">Live</span>
                                                    </h4>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                        Creada el {new Date(key.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteKey(key.id)}
                                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-white border border-gray-100 rounded-xl p-3 font-mono text-sm text-gray-600 truncate shadow-inner">
                                                    {key.key}
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboard(key.key)}
                                                    className={`p-3 rounded-xl transition-all ${copiedKey === key.key ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-white border border-gray-100 text-gray-400 hover:text-gray-900 group-hover:border-gray-200'}`}
                                                >
                                                    {copiedKey === key.key ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                                                </button>
                                            </div>

                                            {key.lastUsed && (
                                                <div className="mt-4 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        Último uso: {new Date(key.lastUsed).toLocaleString()}
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-gray-900">Referencia Rápida</h3>
                                <button className="text-sm font-black text-blue-600 flex items-center gap-2 hover:underline">
                                    Ver Docs <ExternalLink className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Base URL</p>
                                    <div className="bg-white border border-gray-200 rounded-xl p-4 font-mono text-sm text-gray-700 shadow-sm flex justify-between items-center group">
                                        <span>{API_BASE_URL}/api/v1</span>
                                        <button onClick={() => copyToClipboard(`${API_BASE_URL}/api/v1`)} className="text-gray-300 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-all">
                                            <Copy className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Autenticación (Header)</p>
                                    <div className="bg-white border border-gray-200 rounded-xl p-4 font-mono text-sm text-gray-700 shadow-sm">
                                        <span className="text-purple-600">X-API-KEY:</span> <span className="text-gray-400">sk_live_...</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                    <div className="p-4 bg-white rounded-2xl border border-gray-100">
                                        <p className="text-[9px] font-black text-blue-600 mb-1 uppercase tracking-widest">GET</p>
                                        <p className="text-sm font-bold text-gray-900 mb-1">/courses</p>
                                        <p className="text-[10px] text-gray-500">Lista tus cursos publicados</p>
                                    </div>
                                    <div className="p-4 bg-white rounded-2xl border border-gray-100">
                                        <p className="text-[9px] font-black text-green-600 mb-1 uppercase tracking-widest">POST</p>
                                        <p className="text-sm font-bold text-gray-900 mb-1">/enroll</p>
                                        <p className="text-[10px] text-gray-500">Inscribe alumnos externamente</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DevelopersPage;
