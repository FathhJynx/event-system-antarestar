import { sequelize } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const addMissingColumns = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        // Add missing columns to events table
        const columnsToAdd = [
            { name: 'prizepool', type: 'DECIMAL(15, 2) NULL' },
            { name: 'additional_rewards', type: 'TEXT NULL' },
            { name: 'schedule', type: 'TEXT NULL' },
        ];

        for (const col of columnsToAdd) {
            try {
                await sequelize.query(`ALTER TABLE events ADD COLUMN ${col.name} ${col.type};`);
                console.log(`Added column: ${col.name}`);
            } catch (err: any) {
                if (err.original?.code === 'ER_DUP_FIELDNAME') {
                    console.log(`Column ${col.name} already exists, skipping...`);
                } else {
                    console.error(`Error adding column ${col.name}:`, err.message);
                }
            }
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

addMissingColumns();
