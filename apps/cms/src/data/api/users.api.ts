import { API_ROUTES } from "@/domain/constants/api-routes";
import type { PaginatedResponse, PaginationParams } from "@/domain/entities/common.entity";
import type { User } from "@/domain/entities/user.entity";
import { apiClient } from "./api-client";

interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: string;
}

interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: string;
}

export const usersApi = {
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User> | { data: User[] }>({
      path: API_ROUTES.USERS.BASE,
      query: params,
    });

    if ("metadata" in response) {
      return response;
    }

    return {
      data: (response as { data: User[] }).data || [],
      metadata: {
        total: ((response as { data: User[] }).data || []).length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 1,
      },
    };
  },

  getById: async (id: string): Promise<User> => {
    return await apiClient.get<User>(API_ROUTES.USERS.BY_ID(id));
  },

  create: async (data: CreateUserDto): Promise<User> => {
    return await apiClient.post<User>(API_ROUTES.USERS.BASE, data);
  },

  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    return await apiClient.patch<User>(API_ROUTES.USERS.BY_ID(id), data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ROUTES.USERS.BY_ID(id));
  },
};
