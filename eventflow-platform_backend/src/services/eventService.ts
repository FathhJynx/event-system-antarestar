import { Event, EventCategory, Venue, EventPrize, Booking, BookingParticipant } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

const sanitizeEventBody = (body: any) => {
    const sanitized = { ...body };
    const numericFields = ['category_id', 'venue_id', 'max_participants', 'price', 'prizepool'];

    numericFields.forEach(field => {
        if (sanitized[field] === "" || sanitized[field] === undefined) {
            sanitized[field] = null;
        } else if (typeof sanitized[field] === 'string') {
            const num = parseFloat(sanitized[field]);
            sanitized[field] = isNaN(num) ? null : num;
        }
    });

    // Handle date fields
    const dateFields = ['date', 'registration_start', 'registration_end'];
    dateFields.forEach(field => {
        if (sanitized[field] === "" || sanitized[field] === undefined) {
            sanitized[field] = null;
        }
    });

    return sanitized;
};

export const getCategories = async (includeCount: boolean) => {
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
        const categoriesWithCount = categories.map((cat: any) => {
            const json = cat.toJSON();
            return {
                ...json,
                event_count: cat.getDataValue('event_count')
            };
        });

        return categoriesWithCount;
    } else {
        const categories = await EventCategory.findAll();
        return categories;
    }
};

export const getPublicStats = async () => {
    const totalEvents = await Event.count({ where: { status: 'open' } });
    const totalParticipants = await BookingParticipant.count({
        include: [{
            model: Booking,
            where: { payment_status: 'success' },
            required: true
        }]
    });
    const totalVenues = await Venue.count();
    const totalPrizePoolResult = await Event.sum('prizepool', { where: { status: 'open' } });
    const totalPrizePool = totalPrizePoolResult || 0;

    return { totalEvents, totalParticipants, totalVenues, totalPrizePool };
};

export const getEvents = async (query: any) => {
    const { featured, status, limit, search, organizerId } = query;

    const where: any = {};
    if (featured) {
        where.is_featured = featured === 'true';
    }
    if (status) {
        where.status = status;
    }
    if (organizerId) {
        where.user_id = organizerId;
    }
    if (search) {
        where.title = { [Op.like]: `%${search}%` };
    }

    const venueInclude: any = { model: Venue, as: 'venues' };

    const events = await Event.findAll({
        where,
        attributes: {
            include: [
                [
                    literal('(SELECT COUNT(*) FROM booking_participants JOIN bookings ON booking_participants.booking_id = bookings.id WHERE bookings.event_id = Event.id AND bookings.payment_status = "success")'),
                    'registered_count'
                ]
            ]
        },
        include: [
            { model: EventCategory, as: 'event_categories' },
            venueInclude,
        ],

        limit: limit ? parseInt(limit as string) : undefined,
        order: [['date', 'ASC']]
    });

    // Dynamic status update
    const now = new Date();
    const processedEvents = events.map((event: any) => {
        const eventJson = event.toJSON();
        if (eventJson.status === 'open' && eventJson.registration_end && new Date(eventJson.registration_end) < now) {
            eventJson.status = 'closed';
        }
        return {
            ...eventJson,
            registered_count: event.getDataValue('registered_count')
        };
    });

    return processedEvents;
};

export const getEventBySlug = async (slug: string) => {
    let event = await Event.findOne({
        where: { slug },
        attributes: {
            include: [
                [
                    literal('(SELECT COUNT(*) FROM booking_participants JOIN bookings ON booking_participants.booking_id = bookings.id WHERE bookings.event_id = Event.id AND bookings.payment_status = "success")'),
                    'registered_count'
                ]
            ]
        },
        include: [
            { model: EventCategory, as: 'event_categories' },
            { model: Venue, as: 'venues' },
            { model: EventPrize, as: 'event_prizes' },
            {
                model: Booking,
                where: { payment_status: 'success' },
                required: false,
                include: [{
                    model: BookingParticipant,
                    as: 'participants'
                }],
                order: [['created_at', 'ASC']]
            }
        ]
    });

    if (!event) {
        // Try to find by ID (works for both numeric IDs and UUIDs)
        try {
            event = await Event.findByPk(slug, {
                attributes: {
                    include: [
                        [
                            literal('(SELECT COUNT(*) FROM booking_participants JOIN bookings ON booking_participants.booking_id = bookings.id WHERE bookings.event_id = Event.id AND bookings.payment_status = "success")'),
                            'registered_count'
                        ]
                    ]
                },
                include: [
                    { model: EventCategory, as: 'event_categories' },
                    { model: Venue, as: 'venues' },
                    { model: EventPrize, as: 'event_prizes' },
                    {
                        model: Booking,
                        where: { payment_status: 'success' },
                        required: false,
                        include: [{
                            model: BookingParticipant,
                            as: 'participants'
                        }],
                        order: [['created_at', 'ASC']]
                    }
                ]
            });
        } catch (error) {
            // Ignore error if slug is not a valid UUID/ID
        }
    }

    if (!event) {
        throw new Error('Event not found');
    }

    // Dynamic status update
    const eventJson = event.toJSON();
    const now = new Date();
    if (eventJson.status === 'open' && eventJson.registration_end && new Date(eventJson.registration_end) < now) {
        eventJson.status = 'closed';
    }

    return {
        ...eventJson,
        registered_count: event.getDataValue('registered_count')
    };
};

export const createEvent = async (userId: string | number, body: any) => {
    console.log('=== CREATE EVENT DEBUG ===');
    const sanitizedBody = { ...sanitizeEventBody(body), user_id: userId };
    console.log('Sanitized body:', JSON.stringify(sanitizedBody, null, 2));
    const event = await Event.create(sanitizedBody);
    console.log('Event created successfully:', event.id);
    return event;
};

export const updateEvent = async (id: string, userId: string | number, body: any) => {
    console.log('=== UPDATE EVENT DEBUG ===');
    console.log('Event ID:', id);
    console.log('User ID:', userId);

    // Check if event exists and user owns it
    const event = await Event.findByPk(id);
    if (!event) {
        throw new Error('Event not found');
    }

    if (event.user_id !== Number(userId)) {
        throw new Error('Access denied. You do not own this event.');
    }

    const sanitizedBody = sanitizeEventBody(body);
    console.log('Sanitized body:', JSON.stringify(sanitizedBody, null, 2));
    const [updated] = await Event.update(sanitizedBody, { where: { id } });
    console.log('Rows updated:', updated);

    const updatedEvent = await Event.findByPk(id);
    return updatedEvent;
};

export const deleteEvent = async (id: string, userId: string | number) => {
    // Check if event exists and user owns it
    const event = await Event.findByPk(id);
    if (!event) {
        throw new Error('Event not found');
    }

    if (event.user_id !== Number(userId)) {
        throw new Error('Access denied. You do not own this event.');
    }

    const deleted = await Event.destroy({ where: { id } });
    return true;
};

export const getEventParticipants = async (eventId: string) => {
    // Check if event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
        throw new Error('Event not found');
    }

    // Fetch successful bookings with participants
    const bookings = await Booking.findAll({
        where: {
            event_id: eventId,
            payment_status: 'success'
        },
        include: [{
            model: BookingParticipant,
            as: 'participants'
        }],
        order: [['created_at', 'ASC']]
    });

    // Flatten participants and include booking info
    const participants = bookings.flatMap(booking =>
        (booking as any).participants.map((p: any) => ({
            ...p.toJSON(),
            booking_code: booking.code,
            is_checked_in: booking.is_checked_in,
            checked_in_at: booking.checked_in_at
        }))
    );

    return {
        event_title: event.title,
        participants
    };
};
