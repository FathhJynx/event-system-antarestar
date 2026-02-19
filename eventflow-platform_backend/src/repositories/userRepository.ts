import { User } from '../models/index.js';

export const userRepository = {
    async findAll() {
        return User.findAll({
            attributes: { exclude: ['password'] }
        });
    },

    async findById(id: string) {
        return User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
    },

    async findByIdWithPassword(id: string) {
        return User.findByPk(id);
    },

    async findByEmail(email: string) {
        return User.findOne({ where: { email } });
    },

    async create(data: any) {
        return User.create(data);
    },

    async update(id: string, data: any) {
        const [updated] = await User.update(data, { where: { id } });
        if (updated) {
            return User.findByPk(id);
        }
        return null;
    },

    async delete(id: string) {
        return User.destroy({ where: { id } });
    }
};
