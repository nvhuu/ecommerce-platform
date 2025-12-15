import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { Review } from '../../domain/entities/review.entity';
import { IReviewRepository } from '../../domain/repositories/review.repository.interface';

// Type definitions for Review Prisma model (temporary until Prisma client regenerates)
type PrismaReviewCreateInput = {
  rating: number;
  comment?: string;
  userId: string;
  productId: string;
};

type PrismaReviewWithRelations = {
  id: string;
  rating: number;
  comment: string | null;
  userId: string;
  productId: string;
  createdAt: Date;
  user?: unknown;
  product?: unknown;
};

// Extend PrismaService with Review delegate
interface ExtendedPrismaService extends PrismaService {
  review: {
    create(args: {
      data: PrismaReviewCreateInput;
      include?: { user?: boolean; product?: boolean };
    }): Promise<PrismaReviewWithRelations>;
    findMany(args: {
      where?: { productId?: string; userId?: string };
      include?: { user?: boolean; product?: boolean };
      orderBy?: { createdAt?: 'asc' | 'desc' };
    }): Promise<PrismaReviewWithRelations[]>;
  };
}

@Injectable()
export class ReviewRepository implements IReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(review: Review): Promise<Review> {
    const data: PrismaReviewCreateInput = {
      rating: review.rating,
      comment: review.comment,
      userId: review.userId,
      productId: review.productId,
    };

    const extendedPrisma = this.prisma as unknown as ExtendedPrismaService;
    const created = await extendedPrisma.review.create({
      data,
      include: { user: true },
    });

    return Review.toDomain(created) as Review;
  }

  async findByProduct(productId: string): Promise<Review[]> {
    const extendedPrisma = this.prisma as unknown as ExtendedPrismaService;
    const reviews = await extendedPrisma.review.findMany({
      where: { productId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    return reviews
      .map((r) => Review.toDomain(r))
      .filter((r): r is Review => r !== null);
  }

  async findByUser(userId: string): Promise<Review[]> {
    const extendedPrisma = this.prisma as unknown as ExtendedPrismaService;
    const reviews = await extendedPrisma.review.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    return reviews
      .map((r) => Review.toDomain(r))
      .filter((r): r is Review => r !== null);
  }
}
