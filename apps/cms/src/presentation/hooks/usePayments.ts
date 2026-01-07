"use client";

import { paymentsApi, PaymentStatus } from "@/data/api/payments.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const paymentKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentKeys.all, "list"] as const,
  list: (filters?: any) => [...paymentKeys.lists(), { filters }] as const,
  details: () => [...paymentKeys.all, "detail"] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
  byOrder: (orderId: string) => [...paymentKeys.all, "order", orderId] as const,
};

// Get all payments
export const usePayments = (filters?: any) => {
  return useQuery({
    queryKey: paymentKeys.list(filters),
    queryFn: () => paymentsApi.getPayments(filters),
  });
};

// Get payments by order
export const usePaymentsByOrder = (orderId: string) => {
  return useQuery({
    queryKey: paymentKeys.byOrder(orderId),
    queryFn: () => paymentsApi.getPaymentsByOrder(orderId),
    enabled: !!orderId,
  });
};

// Get payment by ID
export const usePayment = (id: string) => {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => paymentsApi.getPaymentById(id),
    enabled: !!id,
  });
};

// Update payment status
export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PaymentStatus }) =>
      paymentsApi.updatePaymentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
    },
  });
};

// Process refund
export const useProcessRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, amount, reason }: { id: string; amount: number; reason: string }) =>
      paymentsApi.processRefund(id, { amount, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
    },
  });
};
