import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IOrderRepository } from '../../../orders/domain/repositories/order.repository.interface';
import { Review } from '../../domain/entities/review.entity';
import { IReviewRepository } from '../../domain/repositories/review.repository.interface';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { ReviewResponseDto } from '../dtos/response/review.response.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject('IReviewRepository')
    private readonly reviewRepository: IReviewRepository,
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async create(
    userId: string,
    dto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    const userReviews = await this.reviewRepository.findByUser(userId);
    const existing = userReviews.find((r) => r.productId === dto.productId);

    if (existing) {
      throw new BadRequestException('You have already reviewed this product');
    }

    const review = new Review();
    review.userId = userId;
    review.productId = dto.productId;
    review.rating = dto.rating;
    review.comment = dto.comment;

    const created = await this.reviewRepository.create(review);
    return plainToClass(ReviewResponseDto, created, {
      excludeExtraneousValues: true,
    });
  }

  async findAllByProduct(productId: string): Promise<ReviewResponseDto[]> {
    const reviews = await this.reviewRepository.findByProduct(productId);
    return reviews.map((review) =>
      plainToClass(ReviewResponseDto, review, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
