import { EventCategory, Event } from '../models/index.js';
import { fn, col } from 'sequelize';

export const categoryRepository = {
    async findAll(includeCount: boolean) {
        if (includeCount) {
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

            // Explicitly map to JSON to ensure event_count is included
            return categories.map((cat: any) => {
                const json = cat.toJSON();
                return {
                    ...json,
                    event_count: cat.getDataValue('event_count') || 0
                };
            });
        } else {
            return EventCategory.findAll();
        }
    },

    async findById(id: string) {
        return EventCategory.findByPk(id);
    },

    async create(data: any) {
        return EventCategory.create(data);
    },

    async update(id: string, data: any) {
        const [updated] = await EventCategory.update(data, { where: { id } });
        if (updated) {
            return EventCategory.findByPk(id);
        }
        return null;
    },

    async delete(id: string) {
        return EventCategory.destroy({ where: { id } });
    }
};
