import type { Request, Response } from 'express';
import * as promoCodeService from '../services/promoCodeService.js';

export const getPromoCodes = async (req: Request, res: Response) => {
    try {
        const organizerId = (req as any).user?.role === 'organizer' ? (req as any).user.id : undefined;
        const promoCodes = await promoCodeService.getPromoCodes(organizerId);
        res.json(promoCodes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching promo codes', error });
    }
};

export const validatePromoCode = async (req: Request, res: Response) => {
    try {
        const { code, eventId } = req.body;
        const promoCode = await promoCodeService.validatePromoCode(code, eventId);
        res.json(promoCode);
    } catch (error: any) {
        if (error.message === 'Invalid or expired promo code') {
            res.status(404).json({ message: 'Invalid or expired promo code' });
        } else if (error.message === 'Promo code usage limit reached') {
            res.status(400).json({ message: 'Promo code usage limit reached' });
        } else {
            res.status(500).json({ message: 'Error validating promo code', error });
        }
    }
};

export const createPromoCode = async (req: Request, res: Response) => {
    try {
        const promoCode = await promoCodeService.createPromoCode(req.body);
        res.status(201).json(promoCode);
    } catch (error) {
        res.status(500).json({ message: 'Error creating promo code', error });
    }
};

export const updatePromoCode = async (req: Request, res: Response) => {
    try {
        const updatedPromoCode = await promoCodeService.updatePromoCode(req.params.id as string, req.body);
        res.json(updatedPromoCode);
    } catch (error: any) {
        if (error.message === 'Promo code not found') {
            res.status(404).json({ message: 'Promo code not found' });
        } else {
            res.status(500).json({ message: 'Error updating promo code', error });
        }
    }
};

export const deletePromoCode = async (req: Request, res: Response) => {
    try {
        await promoCodeService.deletePromoCode(req.params.id as string);
        res.status(204).send();
    } catch (error: any) {
        if (error.message === 'Promo code not found') {
            res.status(404).json({ message: 'Promo code not found' });
        } else {
            res.status(500).json({ message: 'Error deleting promo code', error });
        }
    }
};
