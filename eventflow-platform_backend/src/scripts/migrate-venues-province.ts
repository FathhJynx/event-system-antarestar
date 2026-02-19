import { sequelize } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const migrateProvince = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        try {
            await sequelize.query('ALTER TABLE venues ADD COLUMN province VARCHAR(255) NULL AFTER city;');
            console.log('Added column: province');
        } catch (err: any) {
            if (err.original?.code === 'ER_DUP_FIELDNAME') {
                console.log('Column province already exists, skipping...');
            } else {
                console.error('Error adding column province:', err.message);
            }
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateProvince();
