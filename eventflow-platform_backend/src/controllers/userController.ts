import type { Request, Response } from 'express';
import * as userService from '../services/userService.js';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await userService.getUserById(req.params.id as string);
        res.json(user);
    } catch (error: any) {
        if (error.message === 'User not found') {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(500).json({ message: 'Error fetching user', error });
        }
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.updateUser(req.params.id as string, req.body);
        res.json(result);
    } catch (error: any) {
        if (error.message === 'User not found') {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(500).json({ message: 'Error updating user', error });
        }
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.createUser(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        if (error.message === 'Email already registered') {
            res.status(400).json({ message: 'Email already registered' });
        } else {
            res.status(500).json({ message: 'Error creating user', error });
        }
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        await userService.deleteUser(req.params.id as string);
        res.status(204).send();
    } catch (error: any) {
        if (error.message === 'User not found') {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(500).json({ message: 'Error deleting user', error });
        }
    }
};
