import { Router } from 'express';
import { getVenues, getVenueById, createVenue, updateVenue, deleteVenue } from '../controllers/venueController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getVenues);
router.get('/:id', getVenueById);

// Protected routes
router.post('/', authenticate, createVenue);
router.put('/:id', authenticate, updateVenue);
router.delete('/:id', authenticate, deleteVenue);

export default router;
