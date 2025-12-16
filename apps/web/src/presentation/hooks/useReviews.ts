"use client";

import { reviewsApi } from "@/data/api/reviews.api";
import type { CreateReviewDto } from "@/domain/entities/review.entity";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

// Query keys
export const REVIEWS_KEYS = {
  all: ["reviews"] as const,
  lists: () => [...REVIEWS_KEYS.all, "list"] as const,
  byProduct: (productId: string) => [...REVIEWS_KEYS.lists(), productId] as const,
};

// Get product reviews
export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: REVIEWS_KEYS.byProduct(productId),
    queryFn: () => reviewsApi.getByProduct(productId),
    enabled: !!productId,
  });
}

// Create review mutation
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateReviewDto) => reviewsApi.create(dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: REVIEWS_KEYS.byProduct(variables.productId),
      });
      message.success("Review submitted successfully!");
    },
    onError: (error: Error) => {
      message.error(error.message || "Failed to submit review");
    },
  });
}
