import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface EventCategory {
  id: string | number;
  name: string;
  slug: string;
}

export interface Venue {
  id: string | number;
  name: string;
  location?: string | null;
  city?: string | null;
  province?: string | null;
}

export interface EventPrize {
  id: string;
  event_id: string;
  rank: string;
  prize_amount: number;
}

export interface EventParticipant {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  booking_code: string;
  bib_number?: string | null;
  is_checked_in: boolean;
}

export interface EventParticipantsResponse {
  event_title: string;
  participants: EventParticipant[];
}

export interface EventBooking {
  id: string | number;
  code: string;
  created_at: string;
  participants: EventParticipant[];
}

export interface EventWithDetails {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  is_featured: boolean;
  date: string | null;
  registration_start: string | null;
  registration_end: string | null;
  status: 'open' | 'closed' | 'ended';
  price: number | null;
  prizepool: number | null;
  additional_rewards: string | null;
  schedule: string | null;
  max_participants: number | null;
  registered_count: number;
  route_coordinates?: string | null;
  route_start_name?: string | null;
  route_end_name?: string | null;
  event_categories?: EventCategory;
  venues?: Venue;
  event_prizes?: EventPrize[];
  Bookings?: EventBooking[];
}


export const useEvents = (options?: { featured?: boolean; status?: string; limit?: number }) => {
  return useQuery({
    queryKey: ["events", options],
    queryFn: async () => {
      const response = await api.get("/events", { params: options });
      return response.data as EventWithDetails[];
    },
  });
};

export const useEvent = (idOrSlug: string) => {
  return useQuery({
    queryKey: ["event", idOrSlug],
    queryFn: async () => {
      const response = await api.get(`/events/${idOrSlug}`);
      return response.data as EventWithDetails;
    },
    enabled: !!idOrSlug,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: Partial<EventWithDetails>) => {
      const response = await api.post("/events", event);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<EventWithDetails> & { id: string }) => {
      console.log('=== UPDATE EVENT DEBUG (Frontend) ===');
      console.log('Event ID:', id);
      console.log('Updates being sent:', JSON.stringify(updates, null, 2));
      const response = await api.put(`/events/${id}`, updates);
      console.log('Response:', response.data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", variables.id] });
    },
    onError: (error) => {
      console.error('Update error:', error);
    }
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const usePublicStats = () => {
  return useQuery({
    queryKey: ["public-stats"],
    queryFn: async () => {
      const response = await api.get("/events/stats");
      return response.data as {
        totalEvents: number;
        totalParticipants: number;
        totalVenues: number;
        totalPrizePool: number;
      };
    },
  });
};

export const useEventParticipants = (eventId: string) => {
  return useQuery({
    queryKey: ["event-participants", eventId],
    queryFn: async () => {
      const response = await api.get(`/events/${eventId}/participants`);
      return response.data as EventParticipantsResponse;
    },
    enabled: !!eventId,
  });
};
