import { API_ROUTES } from "@/domain/constants/api-routes";
import type { PaginatedResponse, PaginationParams } from "@/domain/entities/common.entity";
import type { Order, OrderFilters, UpdateOrderStatusDto } from "@/domain/entities/order.entity";
import { apiClient, deleteApi, getApi, patchApi } from "./api-client";

export const ordersApi = {
  getAll: async (params?: PaginationParams & OrderFilters): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<PaginatedResponse<Order> | { data: Order[] }>(
      API_ROUTES.ORDERS.BASE,
      params
    );

    if ("metadata" in response) {
      return response;
    }

    return {
      data: (response as any).data || [],
      metadata: {
        total: ((response as any).data || []).length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 1,
      },
    };
  },

  getById: async (id: string): Promise<Order> => {
    const response = await getApi<Order>(API_ROUTES.ORDERS.BY_ID(id));
    return response.data;
  },

  updateStatus: async (id: string, data: UpdateOrderStatusDto): Promise<Order> => {
    const response = await patchApi<Order>(API_ROUTES.ORDERS.STATUS(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await deleteApi(API_ROUTES.ORDERS.BY_ID(id));
  },
};
