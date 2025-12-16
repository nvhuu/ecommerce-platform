import { API_ROUTES } from "@/domain/constants/api-routes";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/domain/entities/user.entity";
import { getApi, postApi } from "./api-client";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await postApi<AuthResponse>(API_ROUTES.AUTH.LOGIN, credentials);
    // Store token
    if (typeof window !== "undefined" && response.data.accessToken) {
      localStorage.setItem("access_token", response.data.accessToken);
    }
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await postApi<AuthResponse>(API_ROUTES.AUTH.REGISTER, credentials);
    // Store token
    if (typeof window !== "undefined" && response.data.accessToken) {
      localStorage.setItem("access_token", response.data.accessToken);
    }
    return response.data;
  },

  logout: async (): Promise<void> => {
    await postApi(API_ROUTES.AUTH.LOGOUT);
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
  },

  getProfile: async (): Promise<User> => {
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
