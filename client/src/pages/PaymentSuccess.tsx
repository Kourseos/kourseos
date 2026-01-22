import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [courseTitle, setCourseTitle] = useState('');
    const courseId = searchParams.get('courseId');

    useEffect(() => {
        const verifyPayment = async () => {
            const sessionId = searchParams.get('session_id');
            try {
                const response = await fetch(`http://localhost:3000/api/payments/success?sessionId=${sessionId}&courseId=${courseId}`);
                const data = await response.json();
                if (data.success) {
                    setCourseTitle(data.courseTitle);
                }
            } catch (error) {
                console.error("Error verifying payment:", error);
            }
        };
        if (courseId) verifyPayment();
    }, [courseId, searchParams]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl text-center border border-gray-100"
            >
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600">
                    <CheckCircle size={48} />
                </div>

                <h1 className="text-3xl font-black text-gray-900 mb-4">¡Pago Exitoso!</h1>
                <p className="text-gray-600 mb-8 font-medium">
                    Felicidades, ya tienes acceso a <br />
                    <span className="text-purple-600 font-bold">"{courseTitle || 'tu nuevo curso'}"</span>
                </p>

                <div className="space-y-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/course/${courseId}`)}
                        className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-purple-600/20"
                    >
                        Comenzar a aprender
                        <ArrowRight size={20} />
                    </motion.button>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3"
                    >
                        <Home size={20} />
                        Ir al Dashboard
                    </button>
                </div>

                <p className="mt-8 text-xs text-gray-400 font-bold uppercase tracking-widest">
                    Te hemos enviado un email con tus credenciales de acceso.
                </p>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
