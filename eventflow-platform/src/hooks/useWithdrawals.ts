import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Withdrawal {
    id: string | number;
    user_id: string | number;
    amount: number;
    bank_name: string;
    account_number: string;
    account_holder_name: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    notes: string | null;
    proof_of_transfer: string | null;
    requested_at: string;
    approved_at: string | null;
    rejected_at: string | null;
    completed_at: string | null;
    user?: {
        name: string;
        email: string;
    };
    approver?: {
        name: string;
    };
}

export interface WithdrawalStats {
    totalRevenue: number;
    totalEarnings: number;
    pendingWithdrawal: number;
    approvedWithdrawal: number;
    completedWithdrawal: number;
    totalWithdrawn: number;
    balance: number;
    platformFeePercentage: number;
}

export const useWithdrawals = () => {
    return useQuery({
        queryKey: ["withdrawals"],
        queryFn: async () => {
            const response = await api.get("/withdrawals");
            return response.data as Withdrawal[];
        },
    });
};

export const useRequestWithdrawal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Withdrawal>) => {
            const response = await api.post("/withdrawals", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
        },
    });
};

export const useUpdateWithdrawalStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status, notes, proof_of_transfer }: { id: string | number; status: string; notes?: string; proof_of_transfer?: string }) => {
            const response = await api.patch(`/withdrawals/${id}/status`, { status, notes, proof_of_transfer });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
        },
    });
};
export const useOrganizerStats = () => {
    return useQuery({
        queryKey: ["organizer-stats"],
        queryFn: async () => {
            const response = await api.get("/withdrawals/stats");
            return response.data as WithdrawalStats;
        },
    });
};
