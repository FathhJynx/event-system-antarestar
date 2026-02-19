import { sequelize } from './src/config/database.js';

const checkPasswords = async () => {
    try {
        const [users] = await sequelize.query("SELECT id, email, role, password IS NOT NULL as has_password FROM users WHERE email = 'rafi@mail.com'");
        console.log('User Status:');
        console.table(users);
        process.exit(0);
    } catch (error) {
        console.error('Error checking users:', error);
        process.exit(1);
    }
};

checkPasswords();
