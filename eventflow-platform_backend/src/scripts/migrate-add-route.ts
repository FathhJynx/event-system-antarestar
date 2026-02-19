import { sequelize } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const migrateRoute = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        try {
            await sequelize.query('ALTER TABLE events ADD COLUMN route_coordinates TEXT NULL;');
            console.log('Added column: route_coordinates');
        } catch (err: any) {
            if (err.original?.code === 'ER_DUP_FIELDNAME') {
                console.log('Column route_coordinates already exists, skipping...');
            } else {
                console.error('Error adding column route_coordinates:', err.message);
            }
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateRoute();
