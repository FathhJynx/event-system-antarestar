import { Event, Venue, User } from './src/models/index.js';
import { Op } from 'sequelize';

async function diagnose() {
    try {
        const users = await User.findAll({ where: { name: 'fathan' } });
        console.log('--- USERS ---');
        console.log(JSON.stringify(users, null, 2));

        if (users.length === 0) {
            console.log('User fathan not found');
            return;
        }

        const userId = users[0].id;
        console.log(`\nDiagnosing for user ID: ${userId}`);

        const venues = await Venue.findAll({ where: { user_id: userId } });
        console.log('\n--- VENUES OWNED BY FATHAN ---');
        console.log(JSON.stringify(venues, null, 2));

        const venueIds = venues.map(v => v.id);

        const eventsWithVenue = await Event.findAll({
            where: { venue_id: { [Op.in]: venueIds } },
            include: [{ model: Venue, as: 'venues' }]
        });
        console.log('\n--- EVENTS LINKED TO FATHAN\'S VENUES ---');
        console.log(JSON.stringify(eventsWithVenue, null, 2));

        const allEvents = await Event.findAll({
            limit: 5,
            include: [{ model: Venue, as: 'venues' }]
        });
        console.log('\n--- ALL EVENTS (TOP 5) ---');
        console.log(JSON.stringify(allEvents, null, 2));

    } catch (error) {
        console.error('Diagnosis failed:', error);
    } finally {
        process.exit();
    }
}

diagnose();
