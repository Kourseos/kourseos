import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Award, Download, Shield, ExternalLink,
    CheckCircle, Globe, Hash, ArrowLeft, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Usamos el cliente de Supabase directamente si es necesario, 
// o el fetch al backend. El backend ya tiene los datos.

interface CertificateData {
    id: string;
    blockchain_hash: string;
    created_at: string;
    student_name: string;
    courses: {
        title: string;
        creator_id: string;
    };
}

const Certificate = () => {
    const { courseId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [certificate, setCertificate] = useState<CertificateData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                // Consultamos a Supabase vía nuestro backend (o directamente si RLS lo permite)
                // Usamos el endpoint del backend para mantener la lógica centralizada
                const response = await fetch(`http://localhost:3000/api/supabase/courses/${courseId}/certificate_check`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCertificate(data);
                }
            } catch (error) {
                console.error('Error fetching certificate:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token && courseId) fetchCertificate();
    }, [courseId, token]);

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
            <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest">Validando Credenciales...</p>
        </div>
    );

    if (!certificate) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white p-6 text-center">
            <div className="p-8 bg-white/5 rounded-[3rem] border border-white/10 mb-8 opacity-20">
                <Award className="h-24 w-24 text-gray-400" />
            </div>
            <h2 className="text-4xl font-black mb-4 tracking-tighter leading-none">Certificado Aún No Disponible</h2>
            <p className="text-gray-400 mb-10 max-w-md font-medium leading-relaxed italic">
                Para desbloquear este reconocimiento oficial respaldado por IA, debes aprobar el Examen Final con un <span className="text-white font-bold">80%</span> o más.
            </p>
            <button
                onClick={() => navigate(`/quiz/${courseId}`)}
                className="px-12 py-5 bg-white text-black rounded-[2rem] font-black text-lg hover:scale-[1.05] transition-transform shadow-2xl"
            >
                Tomar Examen Final
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-purple-500/30 overflow-hidden relative">
            {/* Ambient Lighting */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[160px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

            <nav className="relative z-20 px-10 py-8 flex justify-between items-center bg-black/40 backdrop-blur-2xl border-b border-white/5">
                <button
                    onClick={() => navigate(`/course/${courseId}`)}
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-all group font-bold"
                >
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Volver al curso</span>
                </button>
                <div className="flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-full border border-white/10">
                    <Shield className="h-4 w-4 text-purple-400" />
                    <span className="font-black text-[10px] tracking-widest text-purple-200">BLOCKCHAIN VERIFIED D-ID: {certificate.id.substring(0, 8)}</span>
                </div>
            </nav>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
                <div className="grid lg:grid-cols-12 gap-16 items-start">

                    {/* Certificate Rendering Area */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-8 group relative"
                    >
                        {/* THE CERTIFICATE CANVAS */}
                        <div className="relative aspect-[1.414/1] bg-white text-slate-900 rounded-sm shadow-[0_80px_160px_-40px_rgba(0,0,0,0.7)] overflow-hidden">
                            {/* Texture Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                            {/* Luxury Borders */}
                            <div className="absolute inset-0 border-[32px] border-slate-50"></div>
                            <div className="absolute inset-[36px] border border-slate-200"></div>
                            <div className="absolute inset-[40px] border-[0.5px] border-slate-300"></div>

                            {/* Corner Accents */}
                            <div className="absolute top-14 left-14 w-32 h-32 border-t-[4px] border-l-[4px] border-slate-100/50"></div>
                            <div className="absolute bottom-14 right-14 w-32 h-32 border-b-[4px] border-r-[4px] border-slate-100/50"></div>

                            {/* Main Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-between py-24 px-16 text-center">
                                <div className="space-y-6">
                                    <div className="flex justify-center mb-10">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-purple-600 blur-3xl opacity-10 rounded-full"></div>
                                            <div className="relative p-6 bg-slate-50 rounded-full shadow-inner">
                                                <Award className="h-16 w-16 text-slate-900" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-sans font-black text-[12px] tracking-[0.5em] text-slate-400 uppercase">Certificado de Finalización</h3>
                                        <div className="h-[1px] w-24 bg-slate-200 mx-auto"></div>
                                    </div>
                                    <h1 className="text-3xl font-serif text-slate-900 tracking-tighter italic">SkillForge AI Masterclass Series</h1>
                                </div>

                                <div className="space-y-10 w-full">
                                    <p className="text-slate-500 font-medium uppercase text-[11px] tracking-widest italic">Este documento certifica legalmente que:</p>
                                    <div className="relative inline-block">
                                        <h2 className="text-6xl font-black tracking-tighter text-slate-900 leading-none">
                                            {certificate.student_name}
                                        </h2>
                                        <div className="absolute -bottom-4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                                    </div>
                                    <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                                        ha completado satisfactoriamente y con grado de excelencia el programa académico intensivo de:
                                    </p>
                                    <h4 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-950 to-slate-500 tracking-tight leading-none">
                                        {certificate.courses.title}
                                    </h4>
                                </div>

                                <div className="flex justify-between items-end w-full px-4">
                                    <div className="text-left space-y-3">
                                        <div className="w-40 h-[1px] bg-slate-300"></div>
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Firma Autorizada IA</p>
                                            <p className="font-serif italic text-lg text-slate-900">SkillForge Autonomous Brain</p>
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <div className="w-28 h-28 rounded-full border-4 border-double border-slate-100 flex items-center justify-center relative bg-slate-50/50 backdrop-blur-sm group-hover:scale-110 transition-transform">
                                            <div className="absolute inset-0 bg-transparent animate-spin-slow rounded-full border-t-2 border-slate-200"></div>
                                            <Shield className="h-10 w-10 text-slate-300" />
                                        </div>
                                    </div>

                                    <div className="text-right space-y-3">
                                        <div className="w-40 h-[1px] bg-slate-300 ml-auto"></div>
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Fecha de Emisión</p>
                                            <p className="text-lg font-black text-slate-900">
                                                {new Date(certificate.created_at).toLocaleDateString('es-ES', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Blockchain Verification Micro-Data */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
                                <p className="text-[7px] font-mono text-slate-300 uppercase tracking-widest leading-none">
                                    VERIFICACIÓN INMUTABLE BLOCKCHAIN ID: {certificate.blockchain_hash}
                                </p>
                            </div>
                        </div>

                        {/* Aesthetic Shadow */}
                        <div className="absolute inset-0 bg-purple-500/10 blur-[120px] -z-10 rounded-full scale-75 opacity-50"></div>
                    </motion.div>

                    {/* Metadata Panel */}
                    <div className="lg:col-span-4 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl shadow-3xl"
                        >
                            <h2 className="text-3xl font-black mb-8 flex items-center gap-4 tracking-tighter">
                                <Shield className="h-8 w-8 text-purple-500" />
                                Credencial Digital
                            </h2>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Certificado Hash (SHA-256)</p>
                                    <div className="p-5 bg-black/50 rounded-2xl border border-white/5 font-mono text-xs break-all text-purple-400 leading-relaxed shadow-inner">
                                        <Hash className="h-4 w-4 inline mr-2 text-purple-600" />
                                        {certificate.blockchain_hash}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Validación Internacional</p>
                                    <div className="flex items-center gap-4 text-emerald-400 font-black bg-emerald-500/10 p-5 rounded-3xl border border-emerald-500/20">
                                        <CheckCircle className="h-6 w-6" />
                                        Registro On-Chain Confirmado
                                    </div>
                                </div>

                                <div className="pt-6 flex flex-col gap-4">
                                    <button className="flex items-center justify-center gap-4 w-full py-6 bg-white text-black rounded-3xl font-black text-lg hover:scale-[1.03] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
                                        <Download className="h-6 w-6" />
                                        Descargar Certificado
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="py-4 bg-white/5 text-xs font-black uppercase tracking-widest rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                                            Compartir
                                        </button>
                                        <button className="py-4 bg-white/5 text-xs font-black uppercase tracking-widest rounded-2xl border border-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                            Link <ExternalLink size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-[3rem] p-10 border border-white/5 space-y-6">
                            <Globe className="h-10 w-10 text-purple-400 shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold mb-2">Validez Permanente</h3>
                                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                    Este certificado no caduca y su autenticidad puede ser validada por cualquier empleador mediante el hash criptográfico único.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Certificate;
