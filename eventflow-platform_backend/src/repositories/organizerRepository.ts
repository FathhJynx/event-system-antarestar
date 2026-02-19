import { Booking, Event, Venue, BookingParticipant, EventCategory } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

export const organizerRepository = {
    async countActiveEvents(organizerId: number | string) {
        return Event.count({
            include: [{
                model: Venue,
                as: 'venues',
                where: { user_id: organizerId },
                required: true
            }],
            where: { status: 'open' }
        });
    },

    async countBookings(organizerId: number | string) {
        return Booking.count({
            include: [{
                model: Event,
                required: true,
                include: [{
                    model: Venue,
                    as: 'venues',
                    where: { user_id: organizerId },
                    required: true
                }]
            }]
        });
    },

    async countTotalParticipants(organizerId: number | string) {
        return BookingParticipant.count({
            include: [{
                model: Booking,
                where: { payment_status: 'success' },
                required: true,
                include: [{
                    model: Event,
                    required: true,
                    include: [{
                        model: Venue,
                        as: 'venues',
                        where: { user_id: organizerId },
                        required: true
                    }]
                }]
            }]
        });
    },

    async sumRevenue(organizerId: number | string) {
        const result = await Booking.findOne({
            attributes: [[fn('SUM', col('total')), 'totalRevenue']],
            where: { payment_status: 'success' },
            include: [{
                model: Event,
                required: true,
                attributes: [],
                include: [{
                    model: Venue,
                    as: 'venues',
                    where: { user_id: organizerId },
                    required: true,
                    attributes: []
                }]
            }],
            raw: true
        });
        return (result as any)?.totalRevenue || 0;
    },

    async getRecentBookings(organizerId: number | string, limit: number) {
        return Booking.findAll({
            limit,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Event,
                    required: true,
                    attributes: ['title'],
                    include: [{
                        model: Venue,
                        as: 'venues',
                        where: { user_id: organizerId },
                        required: true
                    }]
                }
            ]
        });
    },

    async getUpcomingEvents(organizerId: number | string, limit: number) {
        return Event.findAll({
            where: {
                status: 'open',
                date: { [Op.gte]: new Date() }
            },
            attributes: {
                include: [
                    [
                        literal('(SELECT COUNT(*) FROM booking_participants JOIN bookings ON booking_participants.booking_id = bookings.id WHERE bookings.event_id = Event.id AND bookings.payment_status = "success")'),
                        'registered_count'
                    ]
                ]
            },
            include: [{
                model: Venue,
                as: 'venues',
                where: { user_id: organizerId },
                required: true
            }],
            limit,
            order: [['date', 'ASC']]
        });
    },

    async getAllEvents(organizerId: number | string) {
        return Event.findAll({
            include: [
                {
                    model: Venue,
                    as: 'venues',
                    where: { user_id: organizerId },
                    required: true
                },
                { model: EventCategory, as: 'event_categories' }
            ],
            attributes: {
                include: [
                    [
                        literal('(SELECT COUNT(*) FROM booking_participants JOIN bookings ON booking_participants.booking_id = bookings.id WHERE bookings.event_id = Event.id AND bookings.payment_status = "success")'),
                        'registered_count'
                    ]
                ]
            },
            order: [['date', 'ASC']]
        });
    },

    async getAllBookings(organizerId: number | string) {
        return Booking.findAll({
            include: [
                {
                    model: Event,
                    required: true,
                    include: [{
                        model: Venue,
                        as: 'venues',
                        where: { user_id: organizerId },
                        required: true
                    }]
                },
                { model: BookingParticipant, as: 'participants' }
            ],
            order: [['createdAt', 'DESC']]
        });
    }
};
