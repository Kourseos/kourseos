import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatInterfaceProps {
    courseId: string;
    onClose?: () => void;
}

const ChatInterface = ({ courseId, onClose }: ChatInterfaceProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messageCount, setMessageCount] = useState(0);
    const MESSAGE_LIMIT = 3;
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { token } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        // Limitar para leads (sin token)
        if (!token && messageCount >= MESSAGE_LIMIT) {
            setMessages((prev) => [...prev, {
                role: 'assistant',
                content: '✨ Has alcanzado el límite de consultas gratuitas. ¡Inscríbete en el curso completo para obtener acceso ilimitado al Tutor de IA y todo el material exclusivo!'
            }]);
            return;
        }

        const userMessage = { role: 'user' as const, content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: input }),
            });

            if (!response.ok) throw new Error('Failed to send message');

            const data = await response.json();
            setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
            setMessageCount(prev => prev + 1);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prev) => [...prev, { role: 'assistant', content: 'Lo siento, encontré un error. Por favor, inténtalo de nuevo.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col h-[600px] w-full max-w-lg bg-white/80 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] rounded-[2.5rem] overflow-hidden border border-white/50 ring-1 ring-black/5"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-purple-500 blur-lg opacity-40 animate-pulse"></div>
                        <div className="relative p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                            <Bot className="h-5 w-5 text-purple-400" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white font-black text-sm tracking-tight">AI Academic Tutor</h3>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">En línea</span>
                        </div>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {messages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                        >
                            <div className="p-6 bg-white rounded-[2rem] shadow-xl shadow-purple-100 border border-purple-50">
                                <Sparkles className="h-10 w-10 text-purple-600 animate-spin-slow" />
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900">¿En qué puedo ayudarte?</h4>
                                <p className="text-sm text-gray-500 max-w-[200px] mx-auto">Exploremos juntos los conceptos de este curso.</p>
                            </div>
                        </motion.div>
                    )}

                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-[1.8rem] px-6 py-4 shadow-sm ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tr-none'
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                                    }`}
                            >
                                <div className={`flex items-center gap-2 mb-2 ${msg.role === 'user' ? 'justify-end opacity-60' : 'opacity-40'}`}>
                                    {msg.role === 'user' ? (
                                        <User className="h-3 w-3" />
                                    ) : (
                                        <Bot className="h-3 w-3" />
                                    )}
                                    <span className="text-[9px] font-black uppercase tracking-widest">{msg.role === 'user' ? 'Estudiante' : 'Tutor'}</span>
                                </div>
                                <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                            </div>
                        </motion.div>
                    ))}

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white border border-gray-100 rounded-[1.8rem] rounded-tl-none px-6 py-4 flex items-center gap-3">
                                <Loader2 className="h-4 w-4 text-purple-600 animate-spin" />
                                <span className="text-xs font-bold text-gray-400">Analizando...</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 bg-white border-t border-gray-100">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-0 group-focus-within:opacity-10 transition-opacity"></div>
                    <div className="relative flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Haz una pregunta técnica..."
                            className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-gray-900 text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 group/btn"
                        >
                            <Send className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </form>
        </motion.div>
    );
};

export default ChatInterface;

