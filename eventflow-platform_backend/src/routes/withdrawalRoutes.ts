import { Router } from 'express';
import { requestWithdrawal, getWithdrawals, updateWithdrawalStatus, getOrganizerStats } from '../controllers/withdrawalController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/stats', authenticate, getOrganizerStats);
router.get('/', authenticate, getWithdrawals);
router.post('/', authenticate, requestWithdrawal);
router.patch('/:id/status', authenticate, updateWithdrawalStatus);

export default router;
