import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface PromoCode {
  id: string | number;
  code: string;
  discount_amount: number | null;
  discount_percentage: number | null;
  is_active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  usage_limit: number | null;
  usage_count: number;
  event_id: string | number | null;
}

export const usePromoCodes = () => {
  return useQuery({
    queryKey: ["promo-codes"],
    queryFn: async () => {
      const response = await api.get("/promo-codes");
      return response.data as PromoCode[];
    },
  });
};

export const useValidatePromoCode = () => {
  return useMutation({
    mutationFn: async ({ code, eventId }: { code: string; eventId?: string }) => {
      const response = await api.post("/promo-codes/validate", { code, eventId });
      return response.data as PromoCode;
    },
  });
};

export const useCreatePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promoCode: Partial<PromoCode>) => {
      const response = await api.post("/promo-codes", promoCode);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
    },
  });
};

export const useUpdatePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PromoCode> & { id: string }) => {
      const response = await api.put(`/promo-codes/${id}`, updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
    },
  });
};

export const useDeletePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/promo-codes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
    },
  });
};
