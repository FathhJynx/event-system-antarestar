import { Router } from 'express';
import { login, register, getMe, adminLogin } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.get('/me', authenticate, getMe);

export default router;
