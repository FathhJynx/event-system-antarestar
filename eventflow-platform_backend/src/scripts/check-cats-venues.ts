import { sequelize } from './config/database.js';
import { EventCategory, Venue } from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const checkData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const categories = await EventCategory.findAll();
        console.log('Categories:', categories.map(c => ({ id: c.id, name: c.name })));

        const venues = await Venue.findAll();
        console.log('Venues:', venues.map(v => ({ id: v.id, name: v.name })));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

checkData();
