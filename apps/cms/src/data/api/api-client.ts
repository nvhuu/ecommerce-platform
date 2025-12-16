import type {
  ApiError,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/domain/entities/common.entity";
import axios, { type AxiosError, type AxiosInstance } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        // Get token from localStorage (client-side only)
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        // Handle 401 - redirect to login
        if (error.response?.status === 401 && typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
        }

        // Format error
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || "An error occurred",
          error: error.response?.data?.error,
          statusCode: error.response?.status,
        };

        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(endpoint: string, params?: PaginationParams): Promise<T> {
    const response = await this.client.get<T>(endpoint, { params });
    return response.data;
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(endpoint, data);
    return response.data;
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.patch<T>(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.client.delete<T>(endpoint);
    return response.data;
  }

  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const response = await this.client.post<T>(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Type-safe wrapper helpers
export async function getApi<T>(
  endpoint: string,
  params?: PaginationParams
): Promise<ApiResponse<T>> {
  return apiClient.get<ApiResponse<T>>(endpoint, params);
}

export async function getPaginatedApi<T>(
  endpoint: string,
  params?: PaginationParams
): Promise<PaginatedResponse<T>> {
  return apiClient.get<PaginatedResponse<T>>(endpoint, params);
}

export async function postApi<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
  return apiClient.post<ApiResponse<T>>(endpoint, data);
}

export async function patchApi<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
  return apiClient.patch<ApiResponse<T>>(endpoint, data);
}

export async function deleteApi<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiClient.delete<ApiResponse<T>>(endpoint);
}
