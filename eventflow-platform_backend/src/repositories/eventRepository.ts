import { Event, EventCategory, Venue, Booking } from '../models/index.js';
import { Op, literal } from 'sequelize';

export const eventRepository = {
    async findAll(options: any) {
        return Event.findAll(options);
    },

    async findById(id: string) {
        return Event.findByPk(id, {
            include: [
                { model: EventCategory, as: 'event_categories' },
                { model: Venue, as: 'venues' },
            ],
        });
    },

    async findBySlug(slug: string) {
        return Event.findOne({
            where: { slug },
            include: [
                { model: EventCategory, as: 'event_categories' },
                { model: Venue, as: 'venues' },
            ],
        });
    },

    async create(data: any) {
        return Event.create(data);
    },

    async update(id: string, data: any) {
        const [updated] = await Event.update(data, { where: { id } });
        if (updated) {
            return Event.findByPk(id);
        }
        return null;
    },

    async delete(id: string) {
        return Event.destroy({ where: { id } });
    },

    async count(options?: any) {
        return Event.count(options);
    },

    // Specific analytical queries can remain here or move to a specialized repo if they grow
    async getPublicStats() {
        // ... (Logic from service can be moved here if it involves complex queries)
        // For now, simple count is enough, logic stays in service or moves here if complex.
    }
};
