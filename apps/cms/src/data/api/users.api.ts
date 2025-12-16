import { API_ROUTES } from "@/domain/constants/api-routes";
import type { PaginatedResponse, PaginationParams } from "@/domain/entities/common.entity";
import type { User } from "@/domain/entities/user.entity";
import { apiClient, deleteApi, getApi, patchApi, postApi } from "./api-client";

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
    const response = await apiClient.get<PaginatedResponse<User> | { data: User[] }>(
      API_ROUTES.USERS.BASE,
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

  getById: async (id: string): Promise<User> => {
    const response = await getApi<User>(API_ROUTES.USERS.BY_ID(id));
    return response.data;
  },

  create: async (data: CreateUserDto): Promise<User> => {
    const response = await postApi<User>(API_ROUTES.USERS.BASE, data);
    return response.data;
  },

  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await patchApi<User>(API_ROUTES.USERS.BY_ID(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await deleteApi(API_ROUTES.USERS.BY_ID(id));
  },
};
