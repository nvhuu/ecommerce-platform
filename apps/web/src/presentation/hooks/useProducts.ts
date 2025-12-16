"use client";

import { productsApi } from "@/data/api/products.api";
import type { PaginationParams } from "@/domain/entities/common.entity";
import type { ProductFilters } from "@/domain/entities/product.entity";
import { useQuery } from "@tanstack/react-query";

// Query keys
export const PRODUCTS_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCTS_KEYS.all, "list"] as const,
  list: (params?: PaginationParams & ProductFilters) => [...PRODUCTS_KEYS.lists(), params] as const,
  details: () => [...PRODUCTS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PRODUCTS_KEYS.details(), id] as const,
  featured: () => [...PRODUCTS_KEYS.all, "featured"] as const,
};

// Hooks
export function useProducts(params?: PaginationParams & ProductFilters) {
  return useQuery({
    queryKey: PRODUCTS_KEYS.list(params),
    queryFn: () => productsApi.getAll(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: PRODUCTS_KEYS.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}

export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: [...PRODUCTS_KEYS.featured(), limit],
    queryFn: () => productsApi.getFeatured(limit),
  });
}

export function useProductsByCategory(categoryId: string, params?: PaginationParams) {
  return useQuery({
    queryKey: [...PRODUCTS_KEYS.lists(), { categoryId, ...params }],
    queryFn: () => productsApi.getByCategory(categoryId, params),
    enabled: !!categoryId,
  });
}
