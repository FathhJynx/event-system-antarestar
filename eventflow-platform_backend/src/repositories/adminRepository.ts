import { Booking, Event, User, BookingParticipant, Venue } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

export const adminRepository = {
    async countUsers() {
        return User.count({ where: { role: 'user' } });
    },

    async countOrganizers() {
        return User.count({ where: { role: 'organizer' } });
    },

    async countEvents(organizerId?: string | number) {
        const where: any = {};
        if (organizerId) {
            where.user_id = organizerId;
        }
        return Event.count({ where });
    },

    async countActiveEvents(organizerId?: string | number) {
        const where: any = { status: 'open' };
        if (organizerId) {
            where.user_id = organizerId;
        }
        return Event.count({ where });
    },

    async countBookings(status?: string, organizerId?: string | number) {
        const where: any = {};
        if (status) where.payment_status = status;

        const options: any = { where };
        if (organizerId) {
            options.include = [{
                model: Event,
                required: true,
                where: { user_id: organizerId }
            }];
        }
        return Booking.count(options);
    },

    async countTotalParticipants(organizerId?: string | number) {
        const options: any = {
            include: [{
                model: Booking,
                where: { payment_status: 'success' },
                required: true
            }]
        };

        if (organizerId) {
            options.include[0].include = [{
                model: Event,
                required: true,
                where: { user_id: organizerId }
            }];
        }

        return BookingParticipant.count(options);
    },

    async sumRevenue(organizerId?: string | number) {
        if (organizerId) {
            // Get all event IDs owned by this organizer
            const events = await Event.findAll({
                where: { user_id: organizerId },
                attributes: ['id']
            });
            const eventIds = events.map(e => e.id);

            if (eventIds.length === 0) {
                return 0;
            }

            return Booking.sum('total', {
                where: {
                    payment_status: 'success',
                    event_id: { [Op.in]: eventIds }
                }
            });
        }

        return Booking.sum('total', {
            where: { payment_status: 'success' }
        });
    },

    async getRevenueHistory(organizerId?: string | number) {
        const options: any = {
            attributes: [
                [fn('DATE', col('Booking.created_at')), 'date'],
                [fn('SUM', col('total')), 'revenue']
            ],
            where: {
                payment_status: 'success',
                createdAt: {
                    [Op.gte]: literal('DATE_SUB(NOW(), INTERVAL 7 DAY)')
                }
            },
            group: [fn('DATE', col('Booking.created_at'))],
            raw: true
        };

        if (organizerId) {
            options.include = [{
                model: Event,
                required: true,
                where: { user_id: organizerId }
            }];
        }

        return Booking.findAll(options);
    },

    async getUpcomingEvents(limit: number, organizerId?: string | number) {
        const where: any = {
            status: 'open',
            date: { [Op.gte]: new Date() }
        };

        if (organizerId) {
            where.user_id = organizerId;
        }

        const options: any = {
            where,
            limit,
            order: [['date', 'ASC']]
        };

        return Event.findAll(options);
    },

    async countParticipantsByEventId(eventId: string) {
        return BookingParticipant.count({
            include: [{
                model: Booking,
                where: {
                    event_id: eventId,
                    payment_status: 'success'
                },
                required: true
            }]
        });
    }
};
