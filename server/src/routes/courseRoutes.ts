import { Router } from 'express';
import { createCourseStructure, saveCourse, chatWithTutor, generateLessonDetails, getCourses, getCourseById, updateLesson, submitQuiz, generateCertificate, getCertificatesExplorer, getQuizById, addModule, addLesson, getOptimizationSuggestions, resolveOptimizationSuggestion } from '../controllers/courseController';
import { authenticateToken } from '../middleware/authMiddleware';
import { optionalSupabaseAuth } from '../middleware/supabaseAuth';

const router = Router();

router.get('/public/:courseId', getCourseById); // Acceso público para landing pages
router.get('/', authenticateToken, getCourses);
router.get('/:courseId', authenticateToken, getCourseById);
// TODO: Re-enable auth after fixing token issue
router.post('/generate', authenticateToken, createCourseStructure);
router.post('/generate-lesson', authenticateToken, generateLessonDetails);
router.post('/save', authenticateToken, saveCourse);
router.put('/:courseId/lessons/:lessonId', authenticateToken, updateLesson);
router.post('/:courseId/chat', optionalSupabaseAuth, chatWithTutor);
router.post('/quizzes/:quizId/submit', authenticateToken, submitQuiz);
router.post('/:courseId/certificate', authenticateToken, generateCertificate);
router.post('/:courseId/modules', authenticateToken, addModule);
router.post('/modules/:moduleId/lessons', authenticateToken, addLesson);
router.get('/:courseId/optimizations', authenticateToken, getOptimizationSuggestions);
router.patch('/optimizations/:suggestionId/resolve', authenticateToken, resolveOptimizationSuggestion);
router.get('/explorer/certificates', authenticateToken, getCertificatesExplorer);
router.get('/quizzes/:quizId', authenticateToken, getQuizById);

export default router;
