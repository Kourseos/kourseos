import { Router } from 'express';
import { getBalance, requestWithdrawal, getWithdrawals, approveWithdrawal } from '../controllers/withdrawalController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/balance', authenticateToken, getBalance);
router.post('/request', authenticateToken, requestWithdrawal);
router.get('/history', authenticateToken, getWithdrawals);
router.post('/approve/:id', authenticateToken, approveWithdrawal); // En producción esto debería ser Admin Only

export default router;
