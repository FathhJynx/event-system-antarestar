import { sequelize } from './config/database.js';
import { Event } from './models/Event.js';
import dotenv from 'dotenv';
import { DataTypes } from 'sequelize';

dotenv.config();

const runCheck = async () => {
    try {
        console.log('Using DB:', process.env.DB_NAME);
        await sequelize.authenticate();
        console.log('Database connected.');

        // Show config details
        const config = (sequelize as any).config;
        console.log('DB Config:', {
            database: config.database,
            host: config.host,
            port: config.port,
            username: config.username
        });

        // Check attributes
        const attributes = Object.keys(Event.rawAttributes);
        console.log('Has prizepool attribute:', attributes.includes('prizepool'));

        // Try explicit update on ID 2 with STRING values
        console.log('Attempting update on ID 2 with STRING values...');
        const [affected] = await Event.update({
            prizepool: "88888.88",
            schedule: ""
        } as any, {
            where: { id: 2 }
        });
        console.log('Update affected rows:', affected);

        // Fetch ALL events
        const events = await Event.findAll();
        console.log(`Found ${events.length} events in DB:`);
        events.forEach(e => console.log(`- ID: ${e.id}, Title: ${e.title}, Prizepool: ${e.prizepool}, Schedule: ${e.schedule ? e.schedule.substring(0, 20) : 'null'}`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

runCheck();
