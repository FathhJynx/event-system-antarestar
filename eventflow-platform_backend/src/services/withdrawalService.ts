import { withdrawalRepository } from '../repositories/withdrawalRepository.js';
import { bookingRepository } from '../repositories/bookingRepository.js'; // Need to calculate earnings
import { eventRepository } from '../repositories/eventRepository.js'; // Need to find user events
import { Op } from 'sequelize';

export const requestWithdrawal = async (userId: string, data: any) => {
    const { amount, bank_name, account_number, account_holder_name, notes } = data;

    // 1. Calculate Total Earnings
    // Get all events by user
    const events = await eventRepository.findAll({ where: { user_id: userId } });
    const eventIds = events.map((e: any) => e.id);

    // Sum bookings for these events
    const successBookings = await bookingRepository.sum('total', {
        where: {
            event_id: { [Op.in]: eventIds },
            payment_status: 'success'
        }
    });

    const totalRevenue = successBookings || 0;
    const platformFeePercentage = 0.10; // 10%
    const totalEarnings = totalRevenue * (1 - platformFeePercentage);

    // 2. Calculate Total Withdrawn
    const withdrawals = await withdrawalRepository.sumAmount({
        where: {
            user_id: userId,
            status: { [Op.in]: ['pending', 'approved'] }
        }
    });
    const totalWithdrawn = withdrawals || 0;

    // 3. Check Balance
    const balance = totalEarnings - totalWithdrawn;

    if (amount > balance) {
        throw new Error('Insufficient balance');
    }

    // 4. Create Withdrawal
    const withdrawal = await withdrawalRepository.create({
        user_id: Number(userId),
        amount,
        bank_name,
        account_number,
        account_holder_name,
        notes,
        status: 'pending',
        requested_at: new Date()
    });

    return withdrawal;
};

export const getWithdrawals = async (userId: string) => {
    return withdrawalRepository.findByUser(userId);
};

export const getOrganizerStats = async (userId: string) => {
    const events = await eventRepository.findAll({ where: { user_id: userId } });
    const eventIds = events.map((e: any) => e.id);

    const totalRevenue = await bookingRepository.sum('total', {
        where: {
            event_id: { [Op.in]: eventIds },
            payment_status: 'success'
        }
    }) || 0;

    const platformFeePercentage = 0.10;
    const totalEarnings = totalRevenue * (1 - platformFeePercentage);

    const pendingWithdrawal = await withdrawalRepository.sumAmount({
        where: {
            user_id: userId,
            status: 'pending'
        }
    }) || 0;

    const approvedWithdrawal = await withdrawalRepository.sumAmount({
        where: {
            user_id: userId,
            status: 'approved'
        }
    }) || 0;

    const completedWithdrawal = await withdrawalRepository.sumAmount({
        where: {
            user_id: userId,
            status: 'completed'
        }
    }) || 0;

    const totalWithdrawn = pendingWithdrawal + approvedWithdrawal + completedWithdrawal;
    const balance = totalEarnings - (pendingWithdrawal + approvedWithdrawal);

    return {
        totalRevenue,
        totalEarnings,
        pendingWithdrawal,
        approvedWithdrawal,
        completedWithdrawal,
        totalWithdrawn,
        balance,
        platformFeePercentage
    };
};

export const getAllWithdrawals = async () => {
    return withdrawalRepository.findAll();
};

export const updateWithdrawalStatus = async (id: string, status: string, adminNotes?: string) => {
    const withdrawal = await withdrawalRepository.findById(id);
    if (!withdrawal) {
        throw new Error('Withdrawal request not found');
    }

    if (['approved', 'rejected'].includes(withdrawal.status)) {
        throw new Error('Withdrawal request already processed');
    }

    const updated = await withdrawalRepository.update(id, {
        status,
        admin_notes: adminNotes,
        processed_at: new Date()
    });

    return updated;
};
