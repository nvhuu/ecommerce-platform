"use client";

import { authApi } from "@/data/api/auth.api";
import type { LoginCredentials, RegisterCredentials } from "@/domain/entities/user.entity";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useRouter } from "next/navigation";

// Query keys
export const AUTH_KEYS = {
  all: ["auth"] as const,
  profile: () => [...AUTH_KEYS.all, "profile"] as const,
};

// Get user profile
export function useProfile() {
  return useQuery({
    queryKey: AUTH_KEYS.profile(),
    queryFn: () => authApi.getProfile(),
    enabled: authApi.isAuthenticated(),
    retry: false,
  });
}

// Login mutation
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all });
      message.success("Login successful!");
      router.push("/");
    },
    onError: (error: Error) => {
      message.error(error.message || "Login failed");
    },
  });
}

// Register mutation
export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all });
      message.success("Registration successful!");
      router.push("/");
    },
    onError: (error: Error) => {
      message.error(error.message || "Registration failed");
    },
  });
}

// Logout mutation
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.clear();
      message.success("Logged out successfully");
      router.push("/login");
    },
    onError: (error: Error) => {
      message.error(error.message || "Logout failed");
    },
  });
}

// Check if authenticated
export function useAuth() {
  return {
    isAuthenticated: authApi.isAuthenticated(),
    token: authApi.getToken(),
  };
}
