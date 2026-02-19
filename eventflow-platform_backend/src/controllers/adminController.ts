import type { Request, Response } from 'express';
import * as adminService from '../services/adminService.js';


export const getAdminStats = async (req: Request, res: Response) => {
    try {
        const stats = await adminService.getAdminStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};

export const getRecentBookings = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 5;
        const bookings = await adminService.getRecentBookings(limit);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recent bookings', error });
    }
};

export const getUpcomingEvents = async (req: Request, res: Response) => {
    try {
        const result = await adminService.getUpcomingEvents();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching upcoming events', error });
    }
};

export const getRevenueHistory = async (req: Request, res: Response) => {
    try {
        const result = await adminService.getRevenueHistory();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching revenue history', error });
    }
};

export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await adminService.getAllBookings();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
};

export const updateBooking = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const result = await adminService.updateBooking(id, req.body);
        res.json({ message: 'Booking updated successfully', booking: result });
    } catch (error: any) {
        if (error.message === 'Booking not found') {
            res.status(404).json({ message: 'Booking not found' });
        } else {
            res.status(500).json({ message: 'Error updating booking', error });
        }
    }
};

export const deleteBooking = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        await adminService.deleteBooking(id);
        res.json({ message: 'Booking deleted successfully' });
    } catch (error: any) {
        if (error.message === 'Booking not found') {
            res.status(404).json({ message: 'Booking not found' });
        } else {
            res.status(500).json({ message: 'Error deleting booking', error });
        }
    }
};

export const checkInBooking = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const result = await adminService.checkInBooking(id);
        res.json(result);
    } catch (error: any) {
        if (error.message === 'Booking not found') {
            res.status(404).json({ message: 'Booking not found' });
        } else {
            res.status(500).json({ message: 'Error toggling check-in', error });
        }
    }
};

