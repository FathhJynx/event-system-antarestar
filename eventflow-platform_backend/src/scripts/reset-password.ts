import { sequelize } from './config/database.js';
import { User } from './models/index.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const resetPassword = async () => {
    try {
        await sequelize.authenticate();
        const hashedPassword = await bcrypt.hash('password123', 10);
        await User.update({ password: hashedPassword }, { where: { email: 'admin@mail.com' } });
        console.log('Password reset successfully for admin@mail.com');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

resetPassword();
