import { Review } from '../entities/review.entity';

export interface IReviewRepository {
  create(review: Review): Promise<Review>;
  findByProduct(productId: string): Promise<Review[]>;
  findByUser(userId: string): Promise<Review[]>;
  findAll(
    page?: number,
    limit?: number,
    status?: string,
  ): Promise<{ data: Review[]; total: number }>;
  findById(id: string): Promise<Review | null>;
  updateStatus(
    id: string,
    status: 'PENDING' | 'APPROVED' | 'REJECTED',
  ): Promise<Review>;
  delete(id: string): Promise<void>;
}
