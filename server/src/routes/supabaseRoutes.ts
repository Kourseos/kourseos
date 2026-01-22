import { Router } from 'express';
import { authenticateSupabaseToken } from '../middleware/supabaseAuth';
import { getMySupabaseCourses, createSupabaseCourse, enrollInCourse, saveSupabaseFullCourse, saveLead, getMyLeads, generateSupabaseQuiz, submitSupabaseQuiz, getSupabaseCertificate } from '../controllers/supabaseCourseController';

const router = Router();

// Todas estas rutas usan el middleware que valida el token de Supabase
router.get('/courses', authenticateSupabaseToken, getMySupabaseCourses);
router.post('/courses', authenticateSupabaseToken, createSupabaseCourse);
router.post('/save', authenticateSupabaseToken, saveSupabaseFullCourse);
router.post('/enroll', authenticateSupabaseToken, enrollInCourse);
router.post('/leads', authenticateSupabaseToken, saveLead);
router.get('/leads', authenticateSupabaseToken, getMyLeads);
router.get('/quizzes/:courseId', authenticateSupabaseToken, generateSupabaseQuiz);
router.post('/quizzes/:courseId/submit', authenticateSupabaseToken, submitSupabaseQuiz);
router.get('/courses/:courseId/certificate_check', authenticateSupabaseToken, getSupabaseCertificate);

export default router;
