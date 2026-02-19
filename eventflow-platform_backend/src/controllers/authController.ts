import type { Request, Response } from 'express';
import * as authService from '../services/authService.js';

export const register = async (req: Request, res: Response) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        if (error.message === 'Email already registered') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Server error', error });
        }
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const result = await authService.login(req.body);
        res.json(result);
    } catch (error: any) {
        if (error.message === 'Invalid credentials') {
            res.status(401).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Server error', error });
        }
    }
};

export const adminLogin = async (req: Request, res: Response) => {
    try {
        const result = await authService.adminLogin(req.body);
        res.json(result);
    } catch (error: any) {
        if (error.message === 'Invalid admin credentials') {
            res.status(401).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Server error', error });
        }
    }
};

export const getMe = async (req: any, res: Response) => {
    try {
        const result = await authService.getMe(req.user);
        res.json(result);
    } catch (error: any) {
        if (error.message === 'User not found') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Server error', error });
        }
    }
};
