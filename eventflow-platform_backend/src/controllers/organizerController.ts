import type { Request, Response } from 'express';
import * as eventService from '../services/eventService.js';
import * as adminService from '../services/adminService.js';

export const getStats = async (req: Request, res: Response) => {
    try {
        const organizerId = (req as any).user.id;
        const stats = await adminService.getAdminStats(organizerId); // Unified
        res.json(stats);
    } catch (error) {
        console.error('Error fetching organizer stats:', error);
        res.status(500).json({ message: 'Error fetching organizer stats', error });
    }
};

export const getRecentBookings = async (req: Request, res: Response) => {
    try {
        const organizerId = (req as any).user.id;
        const limit = parseInt(req.query.limit as string) || 5;
        const bookings = await adminService.getRecentBookings(limit, organizerId); // Unified
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching recent bookings:', error);
        res.status(500).json({ message: 'Error fetching recent bookings', error });
    }
};

export const getUpcomingEvents = async (req: Request, res: Response) => {
    try {
        const organizerId = (req as any).user.id;
        const events = await adminService.getUpcomingEvents(organizerId); // Unified
        res.json(events);
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        res.status(500).json({ message: 'Error fetching upcoming events', error });
    }
};

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const organizerId = (req as any).user.id;
        const events = await eventService.getEvents({ organizerId }); // Unified
        res.json(events);
    } catch (error) {
        console.error('Error fetching organizer events:', error);
        res.status(500).json({ message: 'Error fetching events', error });
    }
};

export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const organizerId = (req as any).user.id;
        const bookings = await adminService.getAllBookings(organizerId); // Unified
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching organizer bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
};

export const checkInBooking = async (req: Request, res: Response) => {
    try {
        const organizerId = (req as any).user.id;
        const bookingId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        // Verify ownership before allowing check-in
        const result = await adminService.checkInBooking(bookingId, organizerId);
        res.json(result);
    } catch (error: any) {
        res.status(error.message === 'Booking not found' ? 404 : 403).json({
            message: error.message || 'Error updating check-in status',
            error
        });
    }
};
