import type { Request, Response } from 'express';
import * as venueService from '../services/venueService.js';

export const getVenues = async (req: Request, res: Response) => {
    try {
        const organizerId = (req as any).user?.role === 'organizer' ? (req as any).user.id : undefined;
        const venues = await venueService.getVenues(organizerId);
        res.json(venues);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching venues', error });
    }
};

export const getVenueById = async (req: Request, res: Response) => {
    try {
        const venue = await venueService.getVenueById(req.params.id as string);
        res.json(venue);
    } catch (error: any) {
        if (error.message === 'Venue not found') {
            res.status(404).json({ message: 'Venue not found' });
        } else {
            res.status(500).json({ message: 'Error fetching venue', error });
        }
    }
};

export const createVenue = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        if ((req as any).user?.role === 'organizer') {
            data.user_id = (req as any).user.id;
        }
        const venue = await venueService.createVenue(data);
        res.status(201).json(venue);
    } catch (error) {
        res.status(500).json({ message: 'Error creating venue', error });
    }
};

export const updateVenue = async (req: Request, res: Response) => {
    try {
        const updatedVenue = await venueService.updateVenue(req.params.id as string, req.body);
        res.json(updatedVenue);
    } catch (error: any) {
        if (error.message === 'Venue not found') {
            res.status(404).json({ message: 'Venue not found' });
        } else {
            res.status(500).json({ message: 'Error updating venue', error });
        }
    }
};

export const deleteVenue = async (req: Request, res: Response) => {
    try {
        await venueService.deleteVenue(req.params.id as string);
        res.status(204).send();
    } catch (error: any) {
        if (error.message === 'Venue not found') {
            res.status(404).json({ message: 'Venue not found' });
        } else {
            res.status(500).json({ message: 'Error deleting venue', error });
        }
    }
};
