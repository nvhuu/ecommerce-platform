import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Review } from '../../domain/entities/review.entity';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { IReviewRepository } from '../../domain/repositories/review.repository.interface';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject('IReviewRepository')
    private readonly reviewRepository: IReviewRepository,
    // Optional: inject OrderRepository to verify purchase
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async create(
    userId: string,
    productId: string,
    rating: number,
    comment?: string,
  ): Promise<Review> {
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Optional: Verify if user purchased the product
    // For now, allow any authenticated user to review (simpler MVP)

    // Check if user already reviewed?
    // Repository doesn't support findOne by user+product yet, let's skip for MVP or assume frontend handles checks.
    // Or we can fetch all user reviews and filter.
    const userReviews = await this.reviewRepository.findByUser(userId);
    const existing = userReviews.find((r) => r.productId === productId);
    if (existing) {
      throw new BadRequestException('You have already reviewed this product');
    }

    const review = new Review();
    review.userId = userId;
    review.productId = productId;
    review.rating = rating;
    review.comment = comment;

    return this.reviewRepository.create(review);
  }

  async findAllByProduct(productId: string): Promise<Review[]> {
    return this.reviewRepository.findByProduct(productId);
  }
}
