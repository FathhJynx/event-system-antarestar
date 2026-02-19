import { Router } from 'express';
import { createBooking, getUserBookings, midtransNotification, verifyBookingStatus } from '../controllers/bookingController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authenticate, createBooking);
router.get('/', authenticate, getUserBookings);
router.get('/:id/verify', authenticate, verifyBookingStatus);
router.post('/notification', midtransNotification);

export default router;
