import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Booking } from "./useBookings";
import { EventWithDetails } from "./useEvents";

export const useOrganizerStats = () => {
    return useQuery({
        queryKey: ["organizer", "stats"],
        queryFn: async () => {
            const response = await api.get("/organizer/stats");
            return response.data as {
                totalRevenue: number;
                totalBookings: number;
                activeEvents: number;
                totalParticipants: number;
                revenueChange: number;
                bookingsChange: number;
            };
        },
    });
};

export const useOrganizerRecentBookings = () => {
    return useQuery({
        queryKey: ["organizer", "recent-bookings"],
        queryFn: async () => {
            const response = await api.get("/organizer/recent-bookings");
            return response.data as Booking[];
        },
    });
};

export const useOrganizerUpcomingEvents = () => {
    return useQuery({
        queryKey: ["organizer", "upcoming-events"],
        queryFn: async () => {
            const response = await api.get("/organizer/upcoming-events");
            return response.data as any[];
        },
    });
};

export const useOrganizerEvents = () => {
    return useQuery({
        queryKey: ["organizer", "events"],
        queryFn: async () => {
            const response = await api.get("/organizer/events");
            return response.data as EventWithDetails[];
        },
    });
};

export const useOrganizerBookings = () => {
    return useQuery({
        queryKey: ["organizer", "bookings"],
        queryFn: async () => {
            const response = await api.get("/organizer/bookings");
            return response.data as Booking[];
        },
    });
};
