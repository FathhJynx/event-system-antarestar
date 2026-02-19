import type { Request, Response } from 'express';
import * as bookingService from '../services/bookingService.js';

export const createBooking = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const result = await bookingService.createBooking(userId, req.body);
        res.status(201).json(result);
    } catch (error: any) {
        console.error('Create Booking Error:', error);
        if (error.message === 'Event not found') {
            res.status(404).json({ message: 'Event not found' });
        } else if (error.message === 'Anda sudah terdaftar di event ini.') {
            res.status(400).json({ message: 'Anda sudah terdaftar di event ini.' });
        } else {
            res.status(500).json({ message: 'Error creating booking', error });
        }
    }
};

export const getUserBookings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const bookings = await bookingService.getUserBookings(userId);
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
};

export const midtransNotification = async (req: Request, res: Response) => {
    try {
        await bookingService.handleMidtransNotification(req.body);
        res.status(200).send('OK');
    } catch (error: any) {
        console.error('Midtrans notification error:', error);
        if (error.message === 'Booking not found') {
            res.status(404).json({ message: 'Booking not found' });
        } else {
            res.status(500).json({ message: 'Error handling notification', error });
        }
    }
};

export const verifyBookingStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const booking = await bookingService.verifyPaymentStatus(id);
        res.json({ message: 'Status updated', booking });
    } catch (error: any) {
        console.error('Verify Booking Status Error:', error);
        if (error.message === 'Booking not found') {
            res.status(404).json({ message: 'Booking not found' });
        } else {
            res.status(500).json({ message: 'Error verifying payment status', error: error.message || error });
        }
    }
};

