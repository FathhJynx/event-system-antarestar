import { userRepository } from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (data: any) => {
    const { name, email, password, role } = data;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'member',
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token
    };
};

export const login = async (data: any) => {
    const { email, password } = data;
    console.log(`Login attempt for email: ${email}`);

    const user = await userRepository.findByEmail(email);
    if (!user) {
        console.log(`Login failed: User not found for ${email}`);
        throw new Error('Invalid credentials');
    }

    if (!user.password) {
        console.log(`Login failed: No password set for ${email}`);
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log(`Login failed: Password mismatch for ${email}`);
        throw new Error('Invalid credentials');
    }
    console.log(`Login success for ${email}, role: ${user.role}`);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token
    };
};

export const adminLogin = async (data: any) => {
    const { email, password } = data;
    console.log(`Admin login attempt for email: ${email}`);

    const user = await userRepository.findByEmail(email);
    if (!user || !user.password) {
        console.log(`Admin login failed: User not found or no password for ${email}`);
        throw new Error('Invalid admin credentials');
    }

    console.log(`Admin login: User role is ${user.role}`);
    if (user.role !== 'admin') {
        console.log(`Admin login failed: Role ${user.role} is not admin`);
        throw new Error('Invalid admin credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log(`Admin login failed: Password mismatch for ${email}`);
        throw new Error('Invalid admin credentials');
    }
    console.log(`Admin login success for ${email}`);

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token
    };
};

export const getMe = async (user: any) => {
    if (!user) {
        throw new Error('User not found');
    }

    const freshUser = await userRepository.findById(user.id);
    if (!freshUser) {
        throw new Error('User not found');
    }

    return {
        id: freshUser.id,
        name: freshUser.name,
        email: freshUser.email,
        role: freshUser.role,
    };
};
