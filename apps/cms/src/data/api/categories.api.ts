import { API_ROUTES } from "@/domain/constants/api-routes";
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/domain/entities/category.entity";
import type { PaginatedResponse, PaginationParams } from "@/domain/entities/common.entity";
import { apiClient } from "./api-client";

export const categoriesApi = {
  getAll: async (params?: PaginationParams): Promise<Category[]> => {
    const response = await apiClient.get<PaginatedResponse<Category> | { data: Category[] }>({
      path: API_ROUTES.CATEGORIES.BASE,
      query: params,
    });

    // Handle both paginated and simple array response
    if ("metadata" in response) {
      return response.data;
    }
    return (response as { data: Category[] }).data || [];
  },

  getById: async (id: string): Promise<Category> => {
    return await apiClient.get<Category>(API_ROUTES.CATEGORIES.BY_ID(id));
  },

  create: async (data: CreateCategoryDto): Promise<Category> => {
    return await apiClient.post<Category>(API_ROUTES.CATEGORIES.BASE, data);
  },

  update: async (id: string, data: UpdateCategoryDto): Promise<Category> => {
    return await apiClient.patch<Category>(API_ROUTES.CATEGORIES.BY_ID(id), data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ROUTES.CATEGORIES.BY_ID(id));
  },
};
