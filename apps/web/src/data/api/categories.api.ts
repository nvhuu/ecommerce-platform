import { API_ROUTES } from "@/domain/constants/api-routes";
import type { Category } from "@/domain/entities/category.entity";
import { apiClient, getApi } from "./api-client";

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<{ data: Category[] }>(API_ROUTES.CATEGORIES.BASE);
    return response.data;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await getApi<Category>(API_ROUTES.CATEGORIES.BY_ID(id));
    return response.data;
  },
};
