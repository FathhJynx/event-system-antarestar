import { organizerRepository } from '../repositories/organizerRepository.js';

export const getOrganizerStats = async (organizerId: string | number) => {
    const totalRevenue = (await organizerRepository.sumRevenue(organizerId)) || 0;
    const totalBookings = await organizerRepository.countBookings(organizerId);
    const activeEvents = await organizerRepository.countActiveEvents(organizerId);
    const totalParticipants = await organizerRepository.countTotalParticipants(organizerId);

    return {
        totalRevenue,
        totalBookings,
        activeEvents,
        totalParticipants,
        revenueChange: 0,
        bookingsChange: 0,
    };
};

export const getRecentBookings = async (organizerId: string | number, limit: number = 5) => {
    return organizerRepository.getRecentBookings(organizerId, limit);
};

export const getUpcomingEvents = async (organizerId: string | number) => {
    const events = await organizerRepository.getUpcomingEvents(organizerId, 5);

    return events.map((event: any) => {
        return {
            id: event.id,
            name: event.title,
            date: event.date ? new Date(event.date).toLocaleDateString() : 'TBA',
            registered: event.getDataValue('registered_count') || 0,
            quota: event.max_participants || 0,
        };
    });
};

export const getAllEvents = async (organizerId: string | number) => {
    return organizerRepository.getAllEvents(organizerId);
};

export const getAllBookings = async (organizerId: string | number) => {
    return organizerRepository.getAllBookings(organizerId);
};
