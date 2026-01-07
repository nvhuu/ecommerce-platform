import { apiClient } from "./api-client";
import { API_ENDPOINTS } from "./endpoints.constant";

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: Record<string, unknown>;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface OrderFilters {
  status?: OrderStatus;
  userId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export const ordersApi = {
  getAll: async (filters?: OrderFilters) => {
    return await apiClient.get<Order[]>({
      path: API_ENDPOINTS.ORDERS.BASE,
      query: filters,
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
