import { sequelize } from './config/database.js';
import { Booking } from './models/index.js';

const clearBookings = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        // Force sync bookings to clear/recreate or just truncate
        await Booking.destroy({ where: {}, truncate: false }); // truncate: true might fail with FK if not careful, destroy where {} is safer
        console.log('All bookings cleared.');

    } catch (error) {
        console.error('Error clearing bookings:', error);
    } finally {
        await sequelize.close();
    }
};

clearBookings();
