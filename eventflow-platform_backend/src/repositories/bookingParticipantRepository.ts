import { BookingParticipant } from '../models/index.js';

export const bookingParticipantRepository = {
    async create(data: any) {
        return BookingParticipant.create(data);
    },

    async count(options?: any) {
        return BookingParticipant.count(options);
    }
};
