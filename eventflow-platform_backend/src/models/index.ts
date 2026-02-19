import { User } from './User.js';
import { Venue } from './Venue.js';
import { EventCategory } from './EventCategory.js';
import { Event } from './Event.js';
import { EventPrize } from './EventPrize.js';
import { Booking } from './Booking.js';
import { BookingParticipant } from './BookingParticipant.js';

import { PromoCode } from './PromoCode.js';
import { Withdrawal } from './Withdrawal.js';
import { PasswordResetToken, PersonalAccessToken, Session } from './UtilityModels.js';

// Associations
User.hasMany(Venue, { foreignKey: 'user_id' });
Venue.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Event, { foreignKey: 'user_id', as: 'events' });
Event.belongsTo(User, { foreignKey: 'user_id', as: 'organizer' });

EventCategory.hasMany(Event, { foreignKey: 'category_id' });
Event.belongsTo(EventCategory, { foreignKey: 'category_id', as: 'event_categories' });

Venue.hasMany(Event, { foreignKey: 'venue_id' });
Event.belongsTo(Venue, { foreignKey: 'venue_id', as: 'venues' });


Event.hasMany(EventPrize, { foreignKey: 'event_id', as: 'event_prizes' });
EventPrize.belongsTo(Event, { foreignKey: 'event_id' });


Event.hasMany(Booking, { foreignKey: 'event_id' });
Booking.belongsTo(Event, { foreignKey: 'event_id' });

User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.belongsTo(User, { foreignKey: 'user_id' });

Booking.hasMany(BookingParticipant, { foreignKey: 'booking_id', as: 'participants' });
BookingParticipant.belongsTo(Booking, { foreignKey: 'booking_id' });

User.hasMany(Withdrawal, { foreignKey: 'user_id', as: 'withdrawals' });
Withdrawal.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Withdrawal, { foreignKey: 'approved_by', as: 'approved_withdrawals' });
Withdrawal.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });

export {
    User,
    Venue,
    EventCategory,
    Event,
    EventPrize,
    Booking,
    BookingParticipant,

    PromoCode,
    Withdrawal,
    PasswordResetToken,
    PersonalAccessToken,
    Session
};
