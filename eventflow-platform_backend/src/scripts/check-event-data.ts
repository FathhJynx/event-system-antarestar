import { sequelize } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const checkEventData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        const [rows] = await sequelize.query('SELECT id, title, price, prizepool, additional_rewards, schedule FROM events WHERE id = 1');
        console.log('Event 1 data:');
        console.log(JSON.stringify(rows, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Query failed:', error);
        process.exit(1);
    }
};

checkEventData();
