import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

interface AuthRequest extends Request {
    user?: any; // Use any for now or import User instance type
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.log('Authenticate: No token provided');
            res.status(401).json({ message: 'No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.log('Authenticate: Invalid token format');
            res.status(401).json({ message: 'Invalid token format' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
        console.log('Authenticate: Token decoded for user ID:', decoded.id);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            console.log('Authenticate: User not found for ID:', decoded.id);
            res.status(401).json({ message: 'User not found' });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authenticate: Error during authentication:', error);
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
};
