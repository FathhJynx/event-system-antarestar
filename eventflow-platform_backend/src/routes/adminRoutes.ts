import { Router } from 'express';
import {
    getAdminStats,
    getRecentBookings,
    getUpcomingEvents,
    getRevenueHistory,
    getAllBookings,
    updateBooking,
    deleteBooking,
    checkInBooking
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Middleware to check if user is admin
const isAdmin = (req: any, res: any, next: any) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

router.get('/stats', authenticate, isAdmin, getAdminStats);
router.get('/recent-bookings', authenticate, isAdmin, getRecentBookings);
router.get('/upcoming-events', authenticate, isAdmin, getUpcomingEvents);
router.get('/revenue-history', authenticate, isAdmin, getRevenueHistory);

// Booking Management
router.get('/bookings', authenticate, isAdmin, getAllBookings);
router.put('/bookings/:id', authenticate, isAdmin, updateBooking);
router.delete('/bookings/:id', authenticate, isAdmin, deleteBooking);
router.patch('/bookings/:id/check-in', authenticate, isAdmin, checkInBooking);


export default router;
