import { API_ROUTES } from "@/domain/constants/api-routes";
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/domain/entities/category.entity";
import type { PaginatedResponse, PaginationParams } from "@/domain/entities/common.entity";
import { apiClient, deleteApi, getApi, patchApi, postApi } from "./api-client";

export const categoriesApi = {
  getAll: async (params?: PaginationParams): Promise<Category[]> => {
    const response = await apiClient.get<PaginatedResponse<Category> | { data: Category[] }>(
      API_ROUTES.CATEGORIES.BASE,
      params
    );

    // Handle both paginated and simple array response
    if ("metadata" in response) {
      return response.data;
    }
    return (response as any).data || [];
  },

  getById: async (id: string): Promise<Category> => {
    const response = await getApi<Category>(API_ROUTES.CATEGORIES.BY_ID(id));
    return response.data;
  },

  create: async (data: CreateCategoryDto): Promise<Category> => {
    const response = await postApi<Category>(API_ROUTES.CATEGORIES.BASE, data);
    return response.data;
  },

  update: async (id: string, data: UpdateCategoryDto): Promise<Category> => {
    const response = await patchApi<Category>(API_ROUTES.CATEGORIES.BY_ID(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await deleteApi(API_ROUTES.CATEGORIES.BY_ID(id));
  },
};
