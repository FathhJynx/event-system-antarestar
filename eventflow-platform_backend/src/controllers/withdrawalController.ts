import type { Request, Response } from 'express';
import * as withdrawalService from '../services/withdrawalService.js';

export const requestWithdrawal = async (req: any, res: Response) => {
    try {
        const withdrawal = await withdrawalService.requestWithdrawal(req.user.id, req.body);
        res.status(201).json(withdrawal);
    } catch (error: any) {
        if (error.message === 'Insufficient balance') {
            res.status(400).json({ message: 'Insufficient balance' });
        } else {
            res.status(500).json({ message: 'Error requesting withdrawal', error });
        }
    }
};

export const getOrganizerStats = async (req: any, res: Response) => {
    try {
        const stats = await withdrawalService.getOrganizerStats(req.user.id);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching organizer stats', error });
    }
};

export const getWithdrawals = async (req: any, res: Response) => {
    try {
        const withdrawals = await withdrawalService.getWithdrawals(req.user);
        res.json(withdrawals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching withdrawals', error });
    }
};

export const updateWithdrawalStatus = async (req: any, res: Response) => {
    try {
        const withdrawal = await withdrawalService.updateWithdrawalStatus(req.params.id, req.user.id, req.body);
        res.json(withdrawal);
    } catch (error: any) {
        if (error.message === 'Withdrawal not found') {
            res.status(404).json({ message: 'Withdrawal not found' });
        } else {
            res.status(500).json({ message: 'Error updating withdrawal', error });
        }
    }
};
