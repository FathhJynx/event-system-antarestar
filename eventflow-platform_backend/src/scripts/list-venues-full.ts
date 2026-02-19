import { sequelize } from './config/database.js';
import { Venue } from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const listVenues = async () => {
    try {
        await sequelize.authenticate();
        const venues = await Venue.findAll();
        console.log('Full Venues Data:', JSON.stringify(venues, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

listVenues();
