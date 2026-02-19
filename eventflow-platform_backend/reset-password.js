import { sequelize } from './src/config/database.js';
import bcrypt from 'bcrypt';

const resetPassword = async () => {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await sequelize.query("UPDATE users SET password = ? WHERE email = 'rafi@mail.com'", {
            replacements: [hashedPassword]
        });
        console.log('Password for rafi@mail.com reset to: password123');
        process.exit(0);
    } catch (error) {
        console.error('Error resetting password:', error);
        process.exit(1);
    }
};

resetPassword();
