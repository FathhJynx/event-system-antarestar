import { Booking, BookingParticipant, Event } from '../models/index.js';
import { Op } from 'sequelize';

export const bookingRepository = {
    async create(data: any) {
        return Booking.create(data);
    },

    async findById(id: string) {
        return Booking.findByPk(id);
    },

    async findByCode(code: string) {
        return Booking.findOne({ where: { code } });
    },

    async findByUser(userId: string) {
        return Booking.findAll({
            where: { user_id: userId },
            include: [
                { model: Event },
                { model: BookingParticipant, as: 'participants' }
            ],
            order: [['createdAt', 'DESC']]
        });
    },

    async checkOverlap(userId: string, eventId: string) {
        return Booking.findOne({
            where: {
                user_id: userId,
                event_id: eventId,
                payment_status: { [Op.in]: ['pending', 'success'] }
            }
        });
    },

    async save(booking: any) {
        return booking.save();
    },

    async findOne(options: any) {
        return Booking.findOne(options);
    },

    async findAll(options: any) {
        return Booking.findAll(options);
    },

    async sum(field: string, options: any) {
        return Booking.sum(field as any, options);
    },

    async count(options?: any) {
        return Booking.count(options);
    },

    async update(id: string, data: any) {
        const [updated] = await Booking.update(data, { where: { id } });
        if (updated) {
            return Booking.findByPk(id);
        }
        return null;
    },

    async delete(id: string) {
        return Booking.destroy({ where: { id } });
    },

    async findByPk(id: string) {
        return Booking.findByPk(id);
    }
};
