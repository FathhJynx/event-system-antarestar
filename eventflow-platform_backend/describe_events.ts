import { sequelize } from './src/config/database.js';

async function describeTable() {
    try {
        const [results] = await sequelize.query('DESCRIBE events');
        console.log('--- EVENTS TABLE SCHEMA ---');
        console.log(JSON.stringify(results, null, 2));
    } catch (error) {
        console.error('Failed to describe table:', error);
    } finally {
        process.exit();
    }
}

describeTable();
