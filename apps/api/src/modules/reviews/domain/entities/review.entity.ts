import { Expose, Type } from 'class-transformer';
import { BaseEntity } from '@/shared/domain/base.entity';
import { Product } from '../../../products/domain/entities/product.entity';
import { User } from '../../../users/domain/entities/user.entity';

export class Review extends BaseEntity {
  @Expose()
  rating!: number;

  @Expose()
  comment?: string;

  @Expose()
  userId!: string;

  @Expose()
  @Type(() => User)
  user?: User;

  @Expose()
  productId!: string;

  @Expose()
  @Type(() => Product)
  product?: Product;

  static toDomain(input: unknown): Review | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;
    const review = new Review();
    review.id = data.id as string;
    review.rating = Number(data.rating);
    review.comment = data.comment as string | undefined;
    review.userId = data.userId as string;
    review.productId = data.productId as string;

    // Convert dates if they exist (BaseEntity props)
    if (data.createdAt) review.createdAt = data.createdAt as Date;
    // Prisma might give us nested relations, but we usually handle them separately or if included
    // For now basic mapping

    // Map User if present (and not a foreign key string only)
    if (data.user && typeof data.user === 'object') {
      const user = User.toDomain(data.user);
      if (user) review.user = user;
    }

    return review;
  }
}
