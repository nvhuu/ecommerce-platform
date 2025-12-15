import { Review } from '../entities/review.entity';

export interface IReviewRepository {
  create(review: Review): Promise<Review>;
  findByProduct(productId: string): Promise<Review[]>;
  findByUser(userId: string): Promise<Review[]>;
  // We can add findOne, delete etc later
}
