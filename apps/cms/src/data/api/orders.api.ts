import type { Order, OrderFilters, UpdateOrderStatusDto } from "@/domain/entities/order.entity";
import { apiClient } from "./api-client";
import { API_ENDPOINTS } from "./endpoints.constant";

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

export const ordersApi = {
  getAll: async (filters?: OrderFilters) => {
    return await apiClient.get<Order[]>({
      path: API_ENDPOINTS.ORDERS.BASE,
      query: filters as Record<string, string | number | boolean | null | undefined>,
    });
  },

  getById: async (id: string) => {
    return await apiClient.get<Order>({
      path: API_ENDPOINTS.ORDERS.BY_ID,
      params: { id },
    });
  },

  getByUser: async (userId: string) => {
    return await apiClient.get<Order[]>({
      path: API_ENDPOINTS.ORDERS.BY_USER,
      params: { userId },
    });
  },

  updateStatus: async (id: string, data: UpdateOrderStatusDto) => {
    return await apiClient.patch<Order>(
      {
        path: API_ENDPOINTS.ORDERS.UPDATE_STATUS,
        params: { id },
      },
      data
    );
  },

  delete: async (id: string) => {
    return await apiClient.delete({
      path: API_ENDPOINTS.ORDERS.BY_ID,
      params: { id },
    });
  },
};
