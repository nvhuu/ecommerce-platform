import { apiClient } from "./api-client";
import { API_ENDPOINTS } from "./endpoints.constant";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images?: string[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export const productsApi = {
  getAll: async (filters?: ProductFilters) => {
    return await apiClient.get<Product[]>({
      path: API_ENDPOINTS.PRODUCTS.BASE,
      query: filters,
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
      query: filters,
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
