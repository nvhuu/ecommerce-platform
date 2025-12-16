import { API_ROUTES } from "@/domain/constants/api-routes";
import type { AuthResponse, LoginCredentials, User } from "@/domain/entities/user.entity";
import { getApi, postApi } from "./api-client";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await postApi<AuthResponse>(API_ROUTES.AUTH.LOGIN, credentials);

    // Store token in localStorage
    if (response.data.access_token && typeof window !== "undefined") {
      localStorage.setItem("access_token", response.data.access_token);
    }

    return response.data;
  },

  register: async (data: {
    email: string;
    password: string;
    name: string;
  }): Promise<AuthResponse> => {
    const response = await postApi<AuthResponse>(API_ROUTES.AUTH.REGISTER, data);

    if (response.data.access_token && typeof window !== "undefined") {
      localStorage.setItem("access_token", response.data.access_token);
    }

    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await postApi(API_ROUTES.AUTH.LOGOUT);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
    }
  },

  me: async (): Promise<User> => {
    const response = await getApi<User>(API_ROUTES.AUTH.ME);
    return response.data;
  },

  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("access_token");
  },

  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  },
};
