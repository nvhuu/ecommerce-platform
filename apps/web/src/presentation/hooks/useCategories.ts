"use client";

import { categoriesApi } from "@/data/api/categories.api";
import { useQuery } from "@tanstack/react-query";

// Query keys
export const CATEGORIES_KEYS = {
  all: ["categories"] as const,
  lists: () => [...CATEGORIES_KEYS.all, "list"] as const,
  details: () => [...CATEGORIES_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CATEGORIES_KEYS.details(), id] as const,
};

// Hooks
export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_KEYS.lists(),
    queryFn: () => categoriesApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: CATEGORIES_KEYS.detail(id),
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id,
  });
}
