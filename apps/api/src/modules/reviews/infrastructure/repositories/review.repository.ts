import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Review } from '../../domain/entities/review.entity';
import { IReviewRepository } from '../../domain/repositories/review.repository.interface';

@Injectable()
export class ReviewRepository implements IReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(review: Review): Promise<Review> {
    const created = await this.prisma.review.create({
      data: {
        rating: review.rating,
        comment: review.comment,
        userId: review.userId,
        productId: review.productId,
      },
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

  async findAll(
    page = 1,
    limit = 20,
    status?: string,
  ): Promise<{ data: Review[]; total: number }> {
    // ReviewStatus enum in schema: PENDING, APPROVED, REJECTED
    const whereClause: Prisma.ReviewWhereInput = {};
    if (status) {
      whereClause.status = status as Prisma.EnumReviewStatusFilter;
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        include: { user: true, product: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: whereClause }),
    ]);

    return {
      data: reviews
        .map((r) => Review.toDomain(r))
        .filter((r): r is Review => r !== null),
      total,
    };
  }

  async findById(id: string): Promise<Review | null> {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });
    return review ? Review.toDomain(review) : null;
  }

  async updateStatus(
    id: string,
    status: 'PENDING' | 'APPROVED' | 'REJECTED',
  ): Promise<Review> {
    const updated = await this.prisma.review.update({
      where: { id },
      data: { status },
      include: { user: true, product: true },
    });
    return Review.toDomain(updated) as Review;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.review.delete({ where: { id } });
  }
}
