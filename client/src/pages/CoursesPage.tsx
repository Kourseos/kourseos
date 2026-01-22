import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Users, Clock, BarChart3, Search, Filter } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

interface Course {
    id: string;
    title: string;
    description: string;
    moduleCount: number;
    studentCount: number;
    lastUpdated: string;
    progress?: number;
    thumbnail?: string;
    price?: number;
    paymentType?: string;
}

const CoursesPage = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch courses from API
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/courses`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-50">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">SF</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                SkillForge AI
                            </h1>
                            <p className="text-xs text-gray-500">Plataforma Premium</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-xl font-medium transition-colors hover:bg-gray-50 w-full text-left"
                        >
                            <BarChart3 className="h-5 w-5" />
                            <span>Dashboard</span>
                        </button>
                        <button
                            onClick={() => navigate('/courses')}
                            className="flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-600 rounded-xl font-medium w-full text-left"
                        >
                            <BookOpen className="h-5 w-5" />
                            <span>Mis Cursos</span>
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="max-w-7xl mx-auto space-y-8"
                >
                    {/* Header */}
                    <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-2">
                                Mis Cursos
                            </h1>
                            <p className="text-gray-600">Gestiona y crea cursos increíbles con IA</p>
                        </div>
                        <button
                            onClick={() => navigate('/create-course')}
                            className="btn-primary flex items-center gap-2 group"
                        >
                            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                            Crear Nuevo Curso
                        </button>
                    </motion.div>

                    {/* Search and Filters */}
                    <motion.div variants={item} className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar cursos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                            />
                        </div>
                        <button className="btn-secondary flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filtros
                        </button>
                    </motion.div>

                    {/* Courses Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="card p-6 animate-pulse">
                                    <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : courses.length === 0 ? (
                        <motion.div variants={item} className="text-center py-16">
                            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                                <BookOpen className="h-16 w-16 text-primary-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Aún no tienes cursos
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                ¡Crea tu primer curso con IA en minutos! Nuestra tecnología te ayudará a estructurar el contenido perfecto.
                            </p>
                            <button
                                onClick={() => navigate('/create-course')}
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                <Plus className="h-5 w-5" />
                                Crear Mi Primer Curso
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={container}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {courses
                                .filter((course) =>
                                    course.title.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((course) => (
                                    <motion.div
                                        key={course.id}
                                        variants={item}
                                        onClick={() => navigate(`/course/${course.id}`)}
                                        className="card p-6 cursor-pointer group"
                                    >
                                        <div className="h-40 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                                            {course.thumbnail ? (
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <BookOpen className="h-16 w-16 text-primary-500 group-hover:scale-110 transition-transform" />
                                            )}
                                        </div>
                                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                                            {course.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            {course.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="h-4 w-4" />
                                                <span>{course.moduleCount} módulos</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                <span>{course.studentCount}</span>
                                            </div>
                                            {course.price !== undefined && (
                                                <div className="ml-auto font-black text-purple-600">
                                                    ${course.price}
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/course/${course.id}`); }}
                                                className="py-2 text-xs font-bold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                            >
                                                Cursos Estudiante
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); window.open(`/landing/${course.id}`, '_blank'); }}
                                                className="py-2 text-xs font-bold bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                                            >
                                                Página de Venta
                                            </button>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Clock className="h-3 w-3" />
                                                <span>{course.lastUpdated}</span>
                                            </div>
                                            {course.progress !== undefined && (
                                                <div className="text-xs font-bold text-primary-600">
                                                    {course.progress}% completo
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                        </motion.div>
                    )}
                </motion.div>
            </main>
        </div >
    );
};

export default CoursesPage;
