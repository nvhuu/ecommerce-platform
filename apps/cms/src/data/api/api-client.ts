import { translations } from "@/shared/constants/messages.constant";
import { message } from "antd";
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors with toast
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Only show toast on client side
    if (typeof window !== "undefined") {
      // Handle authentication errors
      if (error.response?.status === 401) {
        message.error(translations.errors.auth.sessionExpired);
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Handle other errors with toast
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        translations.errors.network.generic;

      message.error(errorMessage);
    }

    return Promise.reject(error.response?.data || error);
  }
);

// Enhanced API request options
export interface ApiRequestOptions {
  path: string;
  params?: Record<string, string | number>;
  query?: Record<string, string | number | boolean | undefined | null>;
  config?: AxiosRequestConfig;
  silent?: boolean; // Skip error toast for this request
}

// Helper to build full URL with params and query
const buildRequestUrl = (options: string | ApiRequestOptions): string => {
  if (typeof options === "string") {
    return options;
  }

  let url = options.path;

  // Replace path parameters
  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }

  // Add query string
  if (options.query) {
    const searchParams = new URLSearchParams();
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return url;
};

// Get config with silent option
const getConfig = (options: string | ApiRequestOptions, additionalConfig?: AxiosRequestConfig) => {
  const baseConfig = typeof options === "object" ? options.config : additionalConfig;
  const silent = typeof options === "object" ? options.silent : false;

  return {
    ...baseConfig,
    metadata: { silent }, // Pass silent flag through metadata
  };
};

// Enhanced API client with options support
export const apiClient = {
  get: <T = unknown>(options: string | ApiRequestOptions): Promise<T> => {
    const url = buildRequestUrl(options);
    const config = getConfig(options);
    return axiosInstance.get<T, T>(url, config);
  },

  post: <T = unknown>(options: string | ApiRequestOptions, data?: unknown): Promise<T> => {
    const url = buildRequestUrl(options);
    const config = getConfig(options);
    return axiosInstance.post<T, T>(url, data, config);
  },

  patch: <T = unknown>(options: string | ApiRequestOptions, data?: unknown): Promise<T> => {
    const url = buildRequestUrl(options);
    const config = getConfig(options);
    return axiosInstance.patch<T, T>(url, data, config);
  },

  put: <T = unknown>(options: string | ApiRequestOptions, data?: unknown): Promise<T> => {
    const url = buildRequestUrl(options);
    const config = getConfig(options);
    return axiosInstance.put<T, T>(url, data, config);
  },

  delete: <T = unknown>(options: string | ApiRequestOptions): Promise<T> => {
    const url = buildRequestUrl(options);
    const config = getConfig(options);
    return axiosInstance.delete<T, T>(url, config);
  },

  // Upload file with FormData
  uploadFile: async <T = unknown>(path: string, formData: FormData): Promise<T> => {
    return axiosInstance.post(path, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default axiosInstance;
