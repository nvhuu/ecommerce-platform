import { Injectable } from '@nestjs/common';
import { Review } from '../../domain/entities/review.entity';
import { IReviewRepository } from '../../domain/repositories/review.repository.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewRepository implements IReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(review: Review): Promise<Review> {
    const data = {
      rating: review.rating,
      comment: review.comment,
      userId: review.userId,
      productId: review.productId,
    };

    const created = await this.prisma.review.create({
      data,
      include: { user: true },
    });

    return Review.toDomain(created) as Review;
  }

  async findByProduct(productId: string): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    return reviews
      .map((r) => Review.toDomain(r))
      .filter((r): r is Review => r !== null);
  }

  async findByUser(userId: string): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
    return reviews
      .map((r) => Review.toDomain(r))
      .filter((r): r is Review => r !== null);
  }
}
