import { PromoCode, Event, Venue } from '../models/index.js';

export const promoCodeRepository = {
    async findAll(organizerId?: string | number) {
        const options: any = {};
        if (organizerId) {
            options.include = [{
                model: Event,
                required: true,
                include: [{
                    model: Venue,
                    as: 'venues',
                    where: { user_id: organizerId },
                    required: true
                }]
            }];
        }
        return PromoCode.findAll(options);
    },

    async findById(id: string) {
        return PromoCode.findByPk(id);
    },

    async findByCode(code: string) {
        return PromoCode.findOne({ where: { code } });
    },

    async create(data: any) {
        return PromoCode.create(data);
    },

    async update(id: string, data: any) {
        const [updated] = await PromoCode.update(data, { where: { id } });
        if (updated) {
            return PromoCode.findByPk(id);
        }
        return null;
    },

    async delete(id: string) {
        return PromoCode.destroy({ where: { id } });
    },

    async incrementUsage(id: string) {
        return PromoCode.increment('usage_count', { where: { id } });
    }
};
