import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/data/api/auth.api";
import type { LoginCredentials } from "@/domain/entities/user.entity";

export const AUTH_KEYS = {
  me: ["auth", "me"] as const,
};

export function useAuth() {
  return useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: () => authApi.me(),
    retry: false,
    enabled: authApi.isAuthenticated(),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; password: string; name: string }) => authApi.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.clear();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    },
  });
}
