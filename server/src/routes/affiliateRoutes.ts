import { Router } from 'express';
import { createAffiliateLink, getAffiliateStats, trackClick } from '../controllers/affiliateController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/links', authenticateToken, createAffiliateLink);
router.get('/stats', authenticateToken, getAffiliateStats);
router.post('/track/:code', trackClick);

export default router;
