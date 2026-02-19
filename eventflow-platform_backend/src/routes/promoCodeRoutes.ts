import { Router } from 'express';
import { getPromoCodes, validatePromoCode, createPromoCode, updatePromoCode, deletePromoCode } from '../controllers/promoCodeController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, getPromoCodes);
router.post('/validate', validatePromoCode);

// Protected routes
router.post('/', authenticate, createPromoCode);
router.put('/:id', authenticate, updatePromoCode);
router.delete('/:id', authenticate, deletePromoCode);

export default router;
