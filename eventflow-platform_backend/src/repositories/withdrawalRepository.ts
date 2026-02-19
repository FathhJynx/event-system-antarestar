import { Withdrawal } from '../models/index.js';

export const withdrawalRepository = {
    async create(data: any) {
        return Withdrawal.create(data);
    },

    async findByUser(userId: string) {
        return Withdrawal.findAll({
            where: { user_id: userId },
            order: [['requested_at', 'DESC']]
        });
    },

    async findAll() {
        return Withdrawal.findAll({
            order: [['requested_at', 'DESC']]
        });
    },

    async findById(id: string) {
        return Withdrawal.findByPk(id);
    },

    async sumAmount(options: any) {
        return Withdrawal.sum('amount', options);
    },

    async update(id: string, data: any) {
        const [updated] = await Withdrawal.update(data, { where: { id } });
        if (updated) {
            return Withdrawal.findByPk(id);
        }
        return null;
    }
};
