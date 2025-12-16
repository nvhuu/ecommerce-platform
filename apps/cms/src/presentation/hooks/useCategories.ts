import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "@/data/api/categories.api";
import type { CreateCategoryDto, UpdateCategoryDto } from "@/domain/entities/category.entity";
import type { PaginationParams } from "@/domain/entities/common.entity";

export const CATEGORIES_KEYS = {
  all: ["categories"] as const,
  lists: () => [...CATEGORIES_KEYS.all, "list"] as const,
  list: (filters?: PaginationParams) => [...CATEGORIES_KEYS.lists(), filters] as const,
  details: () => [...CATEGORIES_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CATEGORIES_KEYS.details(), id] as const,
};

export function useCategories(params?: PaginationParams) {
  return useQuery({
    queryKey: CATEGORIES_KEYS.list(params),
    queryFn: () => categoriesApi.getAll(params),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: CATEGORIES_KEYS.detail(id),
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEYS.lists() });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      categoriesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEYS.lists() });
    },
  });
}
