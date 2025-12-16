import { API_ROUTES } from "@/domain/constants/api-routes";
import type { PaginatedResponse, PaginationParams } from "@/domain/entities/common.entity";
import type {
  CreateProductDto,
  Product,
  ProductFilters,
  UpdateProductDto,
} from "@/domain/entities/product.entity";
import { apiClient, deleteApi, getApi, patchApi, postApi } from "./api-client";

export const productsApi = {
  getAll: async (
    params?: PaginationParams & ProductFilters
  ): Promise<PaginatedResponse<Product>> => {
    // API returns either paginated or simple array, handle both
    const response = await apiClient.get<PaginatedResponse<Product> | { data: Product[] }>(
      API_ROUTES.PRODUCTS.BASE,
      params
    );

    // Normalize response
    if ("metadata" in response) {
      return response;
    }

    // Convert simple response to paginated format
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

  getById: async (id: string): Promise<Product> => {
    const response = await getApi<Product>(API_ROUTES.PRODUCTS.BY_ID(id));
    return response.data;
  },

  getByCategory: async (
    categoryId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Product>> => {
    return apiClient.get<PaginatedResponse<Product>>(
      API_ROUTES.PRODUCTS.BY_CATEGORY(categoryId),
      params
    );
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await postApi<Product>(API_ROUTES.PRODUCTS.BASE, data);
    return response.data;
  },

  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    const response = await patchApi<Product>(API_ROUTES.PRODUCTS.BY_ID(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await deleteApi(API_ROUTES.PRODUCTS.BY_ID(id));
  },
};
