import { sequelize } from './config/database.js';
import { User } from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const listUsers = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const users = await User.findAll();
        console.log('Users:', users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

listUsers();
