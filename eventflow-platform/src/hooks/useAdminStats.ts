import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Booking } from "./useBookings";

export interface AdminStats {
  totalRevenue: number;
  totalBookings: number;
  activeEvents: number;
  totalParticipants: number;
  revenueChange: number;
  bookingsChange: number;
}

export interface UpcomingEvent {
  id: string | number;
  name: string;
  date: string;
  registered: number;
  quota: number;
}


export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await api.get("/admin/stats");
      return response.data as AdminStats;
    },
  });
};

export const useRecentBookings = (limit = 5) => {
  return useQuery({
    queryKey: ["recent-bookings", limit],
    queryFn: async () => {
      const response = await api.get("/admin/recent-bookings", { params: { limit } });
      return response.data as Booking[];
    },
  });
};

export const useUpcomingEventsStats = () => {
  return useQuery({
    queryKey: ["upcoming-events-stats"],
    queryFn: async () => {
      const response = await api.get("/admin/upcoming-events");
      return response.data as UpcomingEvent[];
    },

  });
};

export const useRevenueHistory = () => {
  return useQuery({
    queryKey: ["revenue-history"],
    queryFn: async () => {
      const response = await api.get("/admin/revenue-history");
      return response.data;
    },
  });
};

