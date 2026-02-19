import { Venue } from '../models/index.js';

export const venueRepository = {
    async findAll(organizerId?: string | number) {
        const where: any = {};
        if (organizerId) {
            where.user_id = organizerId;
        }
        return Venue.findAll({ where });
    },

    async findById(id: string) {
        return Venue.findByPk(id);
    },

    async create(data: any) {
        return Venue.create(data);
    },

    async update(id: string, data: any) {
        const [updated] = await Venue.update(data, { where: { id } });
        if (updated) {
            return Venue.findByPk(id);
        }
        return null;
    },

    async delete(id: string) {
        return Venue.destroy({ where: { id } });
    }
};
