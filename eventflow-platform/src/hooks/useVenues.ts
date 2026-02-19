import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Venue {
  id: string | number;
  name: string;
  address: string | null;
  city: string | null;
  capacity: number | null;
  image: string | null;
}

export const useVenues = () => {
  return useQuery({
    queryKey: ["venues"],
    queryFn: async () => {
      const response = await api.get("/venues");
      return response.data as Venue[];
    },
  });
};

export const useVenue = (id: string) => {
  return useQuery({
    queryKey: ["venue", id],
    queryFn: async () => {
      const response = await api.get(`/venues/${id}`);
      return response.data as Venue;
    },
    enabled: !!id,
  });
};

export const useCreateVenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (venue: Partial<Venue>) => {
      const response = await api.post("/venues", venue);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
    },
  });
};

export const useUpdateVenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Venue> & { id: string }) => {
      const response = await api.put(`/venues/${id}`, updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
    },
  });
};

export const useDeleteVenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/venues/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
    },
  });
};
