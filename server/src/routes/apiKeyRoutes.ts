import { Router } from 'express';
import { generateApiKey, getApiKeys, deleteApiKey } from '../controllers/apiKeyController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, generateApiKey);
router.get('/', authenticateToken, getApiKeys);
router.delete('/:id', authenticateToken, deleteApiKey);

export default router;
