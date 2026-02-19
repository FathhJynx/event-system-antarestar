import { adminRepository } from '../repositories/adminRepository.js';
import { bookingRepository } from '../repositories/bookingRepository.js';
import { Event, BookingParticipant, Venue } from '../models/index.js';
import { Op } from 'sequelize';

export const getAdminStats = async (organizerId?: string | number) => {
    const totalRevenue = (await adminRepository.sumRevenue(organizerId)) || 0;
    const totalBookings = await adminRepository.countBookings(undefined, organizerId);
    const activeEvents = await adminRepository.countActiveEvents(organizerId);
    const totalParticipants = await adminRepository.countTotalParticipants(organizerId);

    return {
        totalRevenue,
        totalBookings,
        activeEvents,
        totalParticipants,
        revenueChange: 12.5, // Placeholder/Calculated elsewhere
        bookingsChange: 8.2, // Placeholder
    };
};

export const getRecentBookings = async (limit: number, organizerId?: string | number) => {
    const options: any = {
        limit,
        order: [['createdAt', 'DESC']],
        include: [{ model: Event, attributes: ['title'] }]
    };

    if (organizerId) {
        options.include[0].include = [{
            model: Venue,
            as: 'venues',
            where: { user_id: organizerId },
            required: true
        }];
    }

    return bookingRepository.findAll(options);
};

export const getUpcomingEvents = async (organizerId?: string | number) => {
    const eventsQuery = await adminRepository.getUpcomingEvents(5, organizerId);

    const result = await Promise.all(eventsQuery.map(async (event: any) => {
        const registered = await adminRepository.countParticipantsByEventId(event.id);

        return {
            id: event.id,
            name: event.title,
            date: event.date ? new Date(event.date).toLocaleDateString() : 'TBA',
            registered,
            quota: event.max_participants || 0,
        };
    }));

    return result;
};

export const getRevenueHistory = async (organizerId?: string | number) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
    }

    const stats = await adminRepository.getRevenueHistory(organizerId);
    const historyMap = new Map((stats as any).map((s: any) => [s.date, Number(s.revenue)]));

    const result = last7Days.map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: historyMap.get(date) || 0
    }));

    return result;
};

export const getAllBookings = async (organizerId?: string | number) => {
    const options: any = {
        include: [
            {
                model: Event,
                include: [{
                    model: Venue,
                    as: 'venues',
                    required: false
                }]
            },
            { model: BookingParticipant, as: 'participants' }
        ],
        order: [['createdAt', 'DESC']]
    };

    if (organizerId) {
        // Find all events owned by this organizer (directly or through venue)
        const ownedEvents = await Event.findAll({
            where: {
                [Op.or]: [
                    { user_id: organizerId }
                ]
            },
            include: [{
                model: Venue,
                as: 'venues',
                where: { user_id: organizerId },
                required: false
            }],
            attributes: ['id']
        });

        // Also get events where the venue is owned by the organizer
        const venueOwnedEvents = await Event.findAll({
            include: [{
                model: Venue,
                as: 'venues',
                where: { user_id: organizerId },
                required: true
            }],
            attributes: ['id']
        });

        // Combine event IDs
        const eventIds = [
            ...ownedEvents.map(e => e.id),
            ...venueOwnedEvents.map(e => e.id)
        ];

        // Remove duplicates
        const uniqueEventIds = [...new Set(eventIds)];

        if (uniqueEventIds.length === 0) {
            return []; // No events owned by this organizer
        }

        // Filter bookings by these event IDs
        options.where = {
            event_id: { [Op.in]: uniqueEventIds }
        };
    }

    return bookingRepository.findAll(options);
};

export const updateBooking = async (id: string, data: any) => {
    const { name, email, phone, payment_status } = data;

    // Check existence
    const booking = await bookingRepository.findById(id);
    if (!booking) {
        throw new Error('Booking not found');
    }

    // Update
    return bookingRepository.update(id, { name, email, phone, payment_status });
};

export const deleteBooking = async (id: string) => {
    const deleted = await bookingRepository.delete(id);
    if (!deleted) {
        throw new Error('Booking not found');
    }
    return true;
};

export const checkInBooking = async (id: string, organizerId?: string | number) => {
    const booking = await bookingRepository.findById(id);
    if (!booking) {
        throw new Error('Booking not found');
    }

    // If organizerId is provided, verify ownership
    if (organizerId) {
        const eventId = booking.event_id ? Number(booking.event_id) : null;
        if (!eventId) {
            throw new Error('Invalid event ID');
        }

        const event: any = await Event.findByPk(eventId, {
            include: [{
                model: Venue,
                as: 'venues',
                required: false
            }]
        });

        if (!event) {
            throw new Error('Event not found');
        }

        // Check if organizer owns the event directly or through venue
        const ownsEvent = event.user_id === Number(organizerId);
        const ownsVenue = event.venues && event.venues.user_id === Number(organizerId);

        if (!ownsEvent && !ownsVenue) {
            throw new Error('Access denied. You do not own this event.');
        }
    }

    const newStatus = !booking.is_checked_in;
    const updatedBooking = await bookingRepository.update(id, {
        is_checked_in: newStatus,
        checked_in_at: newStatus ? new Date() : null
    });

    return {
        message: `Participant ${newStatus ? 'checked in' : 'unchecked'} successfully`,
        booking: updatedBooking
    };
};
