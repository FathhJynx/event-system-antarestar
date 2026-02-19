import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { EventWithDetails } from "./useEvents";

export interface Participant {
  id?: string | number;
  name: string;
  email: string;
  phone: string;
  bib_number?: string;
}

export interface Booking {
  id: string | number;
  event_id: string | number;
  user_id: string | number;
  code: string;
  total: number;
  payment_status: 'pending' | 'success' | 'failed' | 'expired';
  payment_token: string | null;
  name: string;
  email: string;
  phone: string;
  is_checked_in: boolean;
  Event?: EventWithDetails;
  participants?: Participant[];
}

export const useBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await api.get("/bookings");
      return response.data as Booking[];
    },
  });
};

export const useAdminBookings = () => {
  return useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: async () => {
      const response = await api.get("/admin/bookings");
      return response.data as Booking[];
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData: {
      event_id?: string | number;
      promo_code?: string;
      name: string;
      email: string;
      phone: string;
      participants: Participant[];
    }) => {
      const response = await api.post("/bookings", bookingData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Partial<Booking> }) => {
      const response = await api.put(`/admin/bookings/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await api.delete(`/admin/bookings/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useCheckInBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isOrganizer }: { id: string | number; isOrganizer?: boolean }) => {
      const endpoint = isOrganizer ? `/organizer/bookings/${id}/check-in` : `/admin/bookings/${id}/check-in`;
      const response = await api.patch(endpoint);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["organizer", "bookings"] });
    },
  });
};

export const useVerifyBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await api.get(`/bookings/${id}/verify`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
    },
  });
};

export const useBooking = (id: string | number) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      const response = await api.get(`/bookings/${id}`);
      return response.data as Booking;
    },
    enabled: !!id,
  });
};
