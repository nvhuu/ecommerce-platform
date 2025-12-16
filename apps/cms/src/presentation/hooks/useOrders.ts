import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/data/api/orders.api";
import type { PaginationParams } from "@/domain/entities/common.entity";
import type { OrderFilters, UpdateOrderStatusDto } from "@/domain/entities/order.entity";

export const ORDERS_KEYS = {
  all: ["orders"] as const,
  lists: () => [...ORDERS_KEYS.all, "list"] as const,
  list: (filters?: PaginationParams & OrderFilters) => [...ORDERS_KEYS.lists(), filters] as const,
  details: () => [...ORDERS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ORDERS_KEYS.details(), id] as const,
};

export function useOrders(params?: PaginationParams & OrderFilters) {
  return useQuery({
    queryKey: ORDERS_KEYS.list(params),
    queryFn: () => ordersApi.getAll(params),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ORDERS_KEYS.detail(id),
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusDto }) =>
      ordersApi.updateStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.lists() });
    },
  });
}
