import { API_ROUTES } from "@/domain/constants/api-routes";
import type { PaginatedResponse, PaginationParams } from "@/domain/entities/common.entity";
import type { Product, ProductFilters } from "@/domain/entities/product.entity";
import { apiClient, getApi, getPaginatedApi } from "./api-client";

export const productsApi = {
  getAll: async (
    params?: PaginationParams & ProductFilters
  ): Promise<PaginatedResponse<Product>> => {
    return getPaginatedApi<Product>(API_ROUTES.PRODUCTS.BASE, params);
  },

  getById: async (id: string): Promise<Product> => {
    const response = await getApi<Product>(API_ROUTES.PRODUCTS.BY_ID(id));
    return response.data;
  },

  getByCategory: async (
    categoryId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Product>> => {
    return getPaginatedApi<Product>(API_ROUTES.PRODUCTS.BASE, {
      ...params,
      categoryId,
    });
  },

  getFeatured: async (limit = 8): Promise<Product[]> => {
    const response = await apiClient.get<{ data: Product[] }>(
      `${API_ROUTES.PRODUCTS.BASE}?featured=true&limit=${limit}`
    );
    return response.data;
  },
};
