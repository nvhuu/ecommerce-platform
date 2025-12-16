import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/data/api/products.api";
import type { PaginationParams } from "@/domain/entities/common.entity";
import type {
  CreateProductDto,
  ProductFilters,
  UpdateProductDto,
} from "@/domain/entities/product.entity";

export const PRODUCTS_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCTS_KEYS.all, "list"] as const,
  list: (filters?: PaginationParams & ProductFilters) =>
    [...PRODUCTS_KEYS.lists(), filters] as const,
  details: () => [...PRODUCTS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PRODUCTS_KEYS.details(), id] as const,
};

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

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEYS.lists() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      productsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEYS.lists() });
    },
  });
}
