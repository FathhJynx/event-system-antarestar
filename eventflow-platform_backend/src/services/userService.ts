import { userRepository } from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';

export const getUsers = async () => {
    return userRepository.findAll();
};

export const getUserById = async (id: string) => {
    const user = await userRepository.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

export const updateUser = async (id: string, data: any) => {
    const { name, email, role, password } = data;
    const user = await userRepository.findByIdWithPassword(id);

    if (!user) {
        throw new Error('User not found');
    }

    const updates: any = { name, email, role };
    if (password) {
        updates.password = await bcrypt.hash(password, 10);
    }

    await userRepository.update(id, updates);

    // Return the updated user ensuring we fit the return type structure expected by controller if needed, 
    // but the repository update returns a model instance which has these fields.
    // For consistency with previous service return:
    const updatedUser = await userRepository.findById(id);
    if (!updatedUser) return null; // Should not happen

    return { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role };
};

export const createUser = async (data: any) => {
    const { name, email, role, password } = data;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({
        name,
        email,
        role,
        password: hashedPassword
    });

    return { id: user.id, name: user.name, email: user.email, role: user.role };
};

export const deleteUser = async (id: string) => {
    const deleted = await userRepository.delete(id);
    if (!deleted) {
        throw new Error('User not found');
    }
    return true;
};
