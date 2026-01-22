import { Router } from 'express';
import { handleCreateCheckout, handlePaymentSuccess, handleStripeWebhook, getSalesReport, createCoupon, getCoupons, toggleCoupon } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/create-checkout', handleCreateCheckout);
router.get('/success', handlePaymentSuccess);
router.post('/webhook', handleStripeWebhook);

// Rutas privadas para el creador
router.get('/report', authenticateToken, getSalesReport);
router.get('/coupons', authenticateToken, getCoupons);
router.post('/coupons', authenticateToken, createCoupon);
router.patch('/coupons/:id', authenticateToken, toggleCoupon);

export default router;
