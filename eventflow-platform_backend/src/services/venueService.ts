import { venueRepository } from '../repositories/venueRepository.js';

export const getVenues = async (organizerId?: string | number) => {
    return venueRepository.findAll(organizerId);
};

export const getVenueById = async (id: string) => {
    const venue = await venueRepository.findById(id);
    if (!venue) {
        throw new Error('Venue not found');
    }
    return venue;
};

export const createVenue = async (data: any) => {
    return venueRepository.create(data);
};

export const updateVenue = async (id: string, data: any) => {
    const updatedVenue = await venueRepository.update(id, data);
    if (!updatedVenue) {
        throw new Error('Venue not found');
    }
    return updatedVenue;
};

export const deleteVenue = async (id: string) => {
    const deleted = await venueRepository.delete(id);
    if (!deleted) {
        throw new Error('Venue not found');
    }
    return true;
};
