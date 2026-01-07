import { API_ROUTES } from "@/domain/constants/api-routes";
import type { AuthResponse, LoginCredentials, User } from "@/domain/entities/user.entity";
import { apiClient } from "./api-client";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, credentials);

    // Store token in localStorage
    if (response.access_token && typeof window !== "undefined") {
      localStorage.setItem("access_token", response.access_token);
    }

    return response;
  },

  register: async (data: {
    email: string;
    password: string;
    name: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(API_ROUTES.AUTH.REGISTER, data);

    if (response.access_token && typeof window !== "undefined") {
      localStorage.setItem("access_token", response.access_token);
    }

    return response;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post(API_ROUTES.AUTH.LOGOUT);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
    }
  },

  me: async (): Promise<User> => {
    return await apiClient.get<User>(API_ROUTES.AUTH.ME);
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
