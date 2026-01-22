import { Router } from 'express';
import { listPublicCourses, enrollStudentPublic, getStudentProgressPublic } from '../controllers/externalApiController';
import { authenticateApiKey } from '../middleware/apiKeyMiddleware';

const router = Router();

// All routes here require X-API-KEY header
router.get('/courses', authenticateApiKey, listPublicCourses);
router.post('/enroll', authenticateApiKey, enrollStudentPublic);
router.get('/progress', authenticateApiKey, getStudentProgressPublic);

export default router;
