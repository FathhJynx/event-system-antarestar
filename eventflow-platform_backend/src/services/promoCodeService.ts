import { promoCodeRepository } from '../repositories/promoCodeRepository.js';

export const getPromoCodes = async (organizerId?: string | number) => {
    return promoCodeRepository.findAll(organizerId);
};

export const getPromoCodeById = async (id: string) => {
    const promoCode = await promoCodeRepository.findById(id);
    if (!promoCode) {
        throw new Error('Promo code not found');
    }
    return promoCode;
};

export const createPromoCode = async (data: any) => {
    const existingPromo = await promoCodeRepository.findByCode(data.code);
    if (existingPromo) {
        throw new Error('Promo code already exists');
    }
    return promoCodeRepository.create(data);
};

export const updatePromoCode = async (id: string, data: any) => {
    const updatedPromoCode = await promoCodeRepository.update(id, data);
    if (!updatedPromoCode) {
        throw new Error('Promo code not found');
    }
    return updatedPromoCode;
};

export const deletePromoCode = async (id: string) => {
    const deleted = await promoCodeRepository.delete(id);
    if (!deleted) {
        throw new Error('Promo code not found');
    }
    return true;
};

export const validatePromoCode = async (code: string, eventId?: string) => {
    const promo = await promoCodeRepository.findByCode(code);
    if (!promo) {
        return { isValid: false, message: 'Invalid promo code' };
    }

    if (!promo.is_active) {
        return { isValid: false, message: 'Promo code is inactive' };
    }

    const now = new Date();
    if (promo.valid_from && new Date(promo.valid_from) > now) {
        return { isValid: false, message: 'Promo code not yet defined' };
    }

    if (promo.valid_until && new Date(promo.valid_until) < now) {
        return { isValid: false, message: 'Promo code expired' };
    }

    if (promo.usage_limit && promo.usage_count >= promo.usage_limit) {
        return { isValid: false, message: 'Promo code usage limit reached' };
    }

    // Check event restriction
    if (promo.event_id && eventId && promo.event_id != Number(eventId)) {
        return { isValid: false, message: 'Promo code not applicable for this event' };
    }

    return { isValid: true, promo };
};

