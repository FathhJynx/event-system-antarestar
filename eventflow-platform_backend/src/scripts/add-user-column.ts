import { sequelize } from './config/database.js';

const addUserId = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
        await sequelize.query("ALTER TABLE bookings ADD COLUMN user_id BIGINT NULL REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE;");
        console.log('Column user_id added to bookings.');
    } catch (error) {
        console.error('Error adding column:', error);
    } finally {
        await sequelize.close();
    }
};

addUserId();
