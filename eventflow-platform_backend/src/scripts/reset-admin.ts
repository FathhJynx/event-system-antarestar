import { sequelize } from './config/database.js';
import { User } from './models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const resetPassword = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const hashedPassword = await bcrypt.hash('password123', 10);

        const [affected] = await User.update({
            password: hashedPassword
        }, {
            where: { email: 'admin@mail.com' }
        });

        console.log('Password reset affected rows:', affected);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

resetPassword();
