import { sequelize } from './config/database.js';
import { Event, EventCategory } from './models/index.js';
import { fn, col } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const debugCategories = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        console.log('Testing Category Count Query...');

        const categories = await EventCategory.findAll({
            attributes: {
                include: [[fn('COUNT', col('Events.id')), 'event_count']]
            },
            include: [{
                model: Event,
                attributes: [],
                where: { status: 'open' },
                required: false
            }],
            group: ['EventCategory.id']
        });

        console.log('Categories found:', categories.length);
        categories.forEach((cat: any) => {
            console.log(`Category: ${cat.name} (ID: ${cat.id}) - Count (getDataValue): ${cat.getDataValue('event_count')}`);
            console.log(`Category JSON:`, JSON.stringify(cat.toJSON(), null, 2));
        });

        // Debug: Check raw event status and category
        const events = await Event.findAll({
            attributes: ['id', 'title', 'status', 'category_id']
        });
        console.log('Raw Events in DB:', JSON.stringify(events, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

debugCategories();
