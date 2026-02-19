import { sequelize } from './src/config/database.js';

const checkUsers = async () => {
    try {
        const [users] = await sequelize.query("SELECT id, name, email, role FROM users LIMIT 10");
        console.log('Sample Users:');
        console.table(users);
        process.exit(0);
    } catch (error) {
        console.error('Error checking users:', error);
        process.exit(1);
    }
};

checkUsers();
