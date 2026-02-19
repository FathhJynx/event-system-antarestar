import { Router } from 'express';
import { getEvents, getEventBySlug, createEvent, updateEvent, deleteEvent, getCategories, getPublicStats, getEventParticipants } from '../controllers/eventController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/categories', getCategories);
router.get('/stats', getPublicStats);
router.get('/', getEvents);

// Protected routes - must be before /:slug to prevent conflicts
router.post('/', authenticate, createEvent);
router.get('/:id/participants', authenticate, getEventParticipants);
router.put('/:id', authenticate, updateEvent);
router.delete('/:id', authenticate, deleteEvent);

// Dynamic route - must be last
router.get('/:slug', getEventBySlug);

export default router;
