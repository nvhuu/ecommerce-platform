"use client";

import { cartApi } from "@/data/api/cart.api";
import type { AddToCartDto, UpdateCartItemDto } from "@/domain/entities/cart.entity";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

// Query keys
export const CART_KEYS = {
  all: ["cart"] as const,
  detail: () => [...CART_KEYS.all, "detail"] as const,
};

// Get cart hook
export function useCart() {
  return useQuery({
    queryKey: CART_KEYS.detail(),
    queryFn: () => cartApi.getCart(),
    staleTime: 1000, // Refresh frequently
  });
}

// Add to cart mutation
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: AddToCartDto) => cartApi.addItem(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
      message.success("Added to cart!");
    },
    onError: (error: Error) => {
      message.error(error.message || "Failed to add to cart");
    },
  });
}

// Update cart item mutation
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, dto }: { itemId: string; dto: UpdateCartItemDto }) =>
      cartApi.updateItem(itemId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
    },
    onError: (error: Error) => {
      message.error(error.message || "Failed to update cart");
    },
  });
}

// Remove cart item mutation
export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
      message.success("Item removed from cart");
    },
    onError: (error: Error) => {
      message.error(error.message || "Failed to remove item");
    },
  });
}

// Clear cart mutation
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
      message.success("Cart cleared");
    },
    onError: (error: Error) => {
      message.error(error.message || "Failed to clear cart");
    },
  });
}
