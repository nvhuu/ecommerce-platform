import type {
  CreateProductDto,
  Product,
  ProductFilters,
  UpdateProductDto,
} from "@/domain/entities/product.entity";
import { apiClient } from "./api-client";
import { API_ENDPOINTS } from "./endpoints.constant";

export const productsApi = {
  getAll: async (filters?: ProductFilters) => {
    return await apiClient.get<Product[]>({
      path: API_ENDPOINTS.PRODUCTS.BASE,
      query: filters as Record<string, string | number | boolean | null | undefined>,
    });
  },

  getById: async (id: string) => {
    return await apiClient.get<Product>({
      path: API_ENDPOINTS.PRODUCTS.BY_ID,
      params: { id },
    });
  },

  getByCategory: async (categoryId: string, filters?: ProductFilters) => {
    return await apiClient.get<Product[]>({
      path: API_ENDPOINTS.PRODUCTS.BY_CATEGORY,
      params: { categoryId },
      query: filters as Record<string, string | number | boolean | null | undefined>,
    });
  },

  create: async (data: CreateProductDto) => {
    return await apiClient.post<Product>(
      {
        path: API_ENDPOINTS.PRODUCTS.BASE,
      },
      data
    );
  },

  update: async (id: string, data: UpdateProductDto) => {
    return await apiClient.patch<Product>(
      {
        path: API_ENDPOINTS.PRODUCTS.BY_ID,
        params: { id },
      },
      data
    );
  },

  delete: async (id: string) => {
    return await apiClient.delete({
      path: API_ENDPOINTS.PRODUCTS.BY_ID,
      params: { id },
    });
  },
};
