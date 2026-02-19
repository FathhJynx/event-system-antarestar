import { Router } from 'express';
import * as organizerController from '../controllers/organizerController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// All routes here require authentication
router.use(authenticate);

// Role check middleware (optional but good)
const isOrganizer = (req: any, res: any, next: any) => {
    if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Organizer role required.' });
    }
    next();
};

router.use(isOrganizer);

router.get('/stats', organizerController.getStats);
router.get('/recent-bookings', organizerController.getRecentBookings);
router.get('/upcoming-events', organizerController.getUpcomingEvents);
router.get('/events', organizerController.getAllEvents);
router.get('/bookings', organizerController.getAllBookings);
router.patch('/bookings/:id/check-in', organizerController.checkInBooking);

export default router;
