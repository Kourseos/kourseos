import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Award, Shield, Search, ArrowLeft, ExternalLink,
    Hash, BookOpen, Calendar, Sparkles
} from 'lucide-react';

interface Certificate {
    id: string;
    blockchainHash: string;
    issuedAt: string;
    userId: string;
    courseId: string;
    user: {
        name: string;
        email: string;
    };
    course: {
        title: string;
    };
}

const ExplorerCertificates = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAllCertificates = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/courses/explorer/certificates', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setCertificates(data);
                }
            } catch (error) {
                console.error('Error fetching certificates:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchAllCertificates();
    }, [token]);

    const filteredCertificates = certificates.filter(cert =>
        cert.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.blockchainHash.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#020202] text-white selection:bg-purple-500/30">
            {/* Background Mesh */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse duration-5000"></div>
            </div>

            <nav className="relative z-10 p-8 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-white/5 group"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-white" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Shield className="h-4 w-4 text-purple-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Administrador / Sistema</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight">Explorador de Certificados</h1>
                        </div>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar por usuario, curso o hash..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/10 transition-all font-medium"
                        />
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-8 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 bg-white/5 rounded-[2.5rem] animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCertificates.map((cert) => (
                            <motion.div
                                key={cert.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/[0.08] transition-all hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer"
                                onClick={() => navigate(`/course/${cert.courseId}/certificate`)}
                            >
                                <div className="absolute top-6 right-6 p-2 bg-purple-500/10 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-all text-purple-400">
                                    <ExternalLink className="h-4 w-4" />
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-14 w-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-purple-500/20">
                                        {cert.user.name[0]}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-lg truncate group-hover:text-purple-400 transition-colors">{cert.user.name}</h3>
                                        <p className="text-gray-500 text-xs truncate">{cert.user.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-400 group-hover:text-gray-300 transition-colors">
                                        <BookOpen className="h-4 w-4" />
                                        <span className="text-sm font-medium truncate">{cert.course.title}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm font-medium">Emitido: {new Date(cert.issuedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs bg-black/40 p-4 rounded-2xl border border-white/5 font-mono text-purple-300/60 overflow-hidden group-hover:text-purple-400 transition-colors">
                                        <Hash className="h-3 w-3 shrink-0" />
                                        <span className="truncate">{cert.blockchainHash}</span>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-between text-[10px] font-black tracking-widest text-gray-500 group-hover:text-white/50 transition-colors">
                                    <div className="flex items-center gap-1">
                                        <Sparkles className="h-3 w-3" />
                                        VERIFIED TRANSACTION
                                    </div>
                                    <span>#{cert.id.slice(0, 8)}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!loading && filteredCertificates.length === 0 && (
                    <div className="text-center py-40 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                        <Award className="h-20 w-20 text-white/5 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-gray-500">No se encontraron registros</h3>
                        <p className="text-gray-600">Asegúrate de que existan certificados emitidos en el sistema.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ExplorerCertificates;
