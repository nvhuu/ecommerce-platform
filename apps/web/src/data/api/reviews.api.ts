import { API_ROUTES } from "@/domain/constants/api-routes";
import type { CreateReviewDto, Review } from "@/domain/entities/review.entity";
import { apiClient, postApi } from "./api-client";

export const reviewsApi = {
  getByProduct: async (productId: string): Promise<Review[]> => {
    const response = await apiClient.get<{ data: Review[] }>(
      `${API_ROUTES.REVIEWS.BASE}?productId=${productId}`
    );
    return response.data;
  },

  create: async (dto: CreateReviewDto): Promise<Review> => {
    const response = await postApi<Review>(API_ROUTES.REVIEWS.BASE, dto);
    return response.data;
  },
};
