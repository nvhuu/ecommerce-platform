import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/data/api/users.api";
import type { PaginationParams } from "@/domain/entities/common.entity";

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

export const USERS_KEYS = {
  all: ["users"] as const,
  lists: () => [...USERS_KEYS.all, "list"] as const,
  list: (filters?: PaginationParams) => [...USERS_KEYS.lists(), filters] as const,
  details: () => [...USERS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...USERS_KEYS.details(), id] as const,
};

export function useUsers(params?: PaginationParams) {
  return useQuery({
    queryKey: USERS_KEYS.list(params),
    queryFn: () => usersApi.getAll(params),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: USERS_KEYS.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDto) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) => usersApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() });
    },
  });
}
