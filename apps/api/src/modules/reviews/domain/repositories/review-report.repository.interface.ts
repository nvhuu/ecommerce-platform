import { Prisma } from '@prisma/client';
import { ReviewReport } from '../entities/review-report.entity';

export interface IReviewReportRepository {
  create(data: Prisma.ReviewReportCreateInput): Promise<ReviewReport>;

  findAll(filters?: {
    status?: string;
    reviewId?: string;
  }): Promise<ReviewReport[]>;

  findById(id: string): Promise<ReviewReport | null>;

  update(
    id: string,
    data: Prisma.ReviewReportUpdateInput,
  ): Promise<ReviewReport>;

  findPending(): Promise<ReviewReport[]>;

  countByReview(reviewId: string): Promise<number>;
}

export const REVIEW_REPORT_REPOSITORY_TOKEN = 'IReviewReportRepository';
