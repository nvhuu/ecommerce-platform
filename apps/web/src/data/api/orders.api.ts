import { API_ROUTES } from "@/domain/constants/api-routes";
import type { PaginatedResponse, PaginationParams } from "@/domain/entities/common.entity";
import type { CreateOrderDto, Order, OrderFilters } from "@/domain/entities/order.entity";
import { getApi, getPaginatedApi, postApi } from "./api-client";

export const ordersApi = {
  create: async (dto: CreateOrderDto): Promise<Order> => {
    const response = await postApi<Order>(API_ROUTES.ORDERS.BASE, dto);
    return response.data;
  },

  getMyOrders: async (
    params?: PaginationParams & OrderFilters
  ): Promise<PaginatedResponse<Order>> => {
    return getPaginatedApi<Order>(API_ROUTES.ORDERS.MY_ORDERS, params);
  },

  getById: async (id: string): Promise<Order> => {
    const response = await getApi<Order>(API_ROUTES.ORDERS.BY_ID(id));
    return response.data;
  },
};
