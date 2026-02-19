import type { Request, Response } from 'express';
import * as eventService from '../services/eventService.js';

export const getEventParticipants = async (req: Request, res: Response) => {
    try {
        const participants = await eventService.getEventParticipants(req.params.id as string);
        res.json(participants);
    } catch (error: any) {
        if (error.message === 'Event not found') {
            res.status(404).json({ message: 'Event not found' });
        } else {
            res.status(500).json({ message: 'Error fetching event participants', error: error.message });
        }
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
        console.log('Query Params:', req.query);
        const includeCount = req.query.includeCount === 'true';
        console.log('IncludeCount:', includeCount);
        const categories = await eventService.getCategories(includeCount);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
};

export const getPublicStats = async (req: Request, res: Response) => {
    try {
        const stats = await eventService.getPublicStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching public stats', error });
    }
};

export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await eventService.getEvents(req.query);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error });
    }
};

export const getEventBySlug = async (req: Request, res: Response) => {
    try {
        const event = await eventService.getEventBySlug(req.params.slug as string);
        res.json(event);
    } catch (error: any) {
        if (error.message === 'Event not found') {
            res.status(404).json({ message: 'Event not found' });
        } else {
            res.status(500).json({ message: 'Error fetching event', error });
        }
    }
};

export const createEvent = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const event = await eventService.createEvent(userId, req.body);
        res.status(201).json(event);
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ message: 'Error creating event', error: error instanceof Error ? error.message : error });
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const updatedEvent = await eventService.updateEvent(req.params.id as string, userId, req.body);
        res.json(updatedEvent);
    } catch (error: any) {
        console.error('Update error:', error);
        if (error.message === 'Event not found') {
            res.status(404).json({ message: 'Event not found' });
        } else if (error.message === 'Access denied. You do not own this event.') {
            res.status(403).json({ message: 'Access denied. You do not own this event.' });
        } else {
            res.status(500).json({ message: 'Error updating event', error: error instanceof Error ? error.message : error });
        }
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        await eventService.deleteEvent(req.params.id as string, userId);
        res.status(204).send();
    } catch (error: any) {
        if (error.message === 'Event not found') {
            res.status(404).json({ message: 'Event not found' });
        } else if (error.message === 'Access denied. You do not own this event.') {
            res.status(403).json({ message: 'Access denied. You do not own this event.' });
        } else {
            res.status(500).json({ message: 'Error deleting event', error });
        }
    }
};
