"use client";

import { ordersApi } from "@/data/api/orders.api";
import type { PaginationParams } from "@/domain/entities/common.entity";
import type { CreateOrderDto, OrderFilters } from "@/domain/entities/order.entity";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { CART_KEYS } from "./useCart";

// Query keys
export const ORDERS_KEYS = {
  all: ["orders"] as const,
  lists: () => [...ORDERS_KEYS.all, "list"] as const,
  list: (params?: PaginationParams & OrderFilters) => [...ORDERS_KEYS.lists(), params] as const,
  details: () => [...ORDERS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ORDERS_KEYS.details(), id] as const,
};

// Get my orders
export function useMyOrders(params?: PaginationParams & OrderFilters) {
  return useQuery({
    queryKey: ORDERS_KEYS.list(params),
    queryFn: () => ordersApi.getMyOrders(params),
  });
}

// Get order by ID
export function useOrder(id: string) {
  return useQuery({
    queryKey: ORDERS_KEYS.detail(id),
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
}

// Create order mutation
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateOrderDto) => ordersApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
      message.success("Order placed successfully!");
    },
    onError: (error: Error) => {
      message.error(error.message || "Failed to create order");
    },
  });
}
