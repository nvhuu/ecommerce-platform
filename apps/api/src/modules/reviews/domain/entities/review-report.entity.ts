import { Expose } from 'class-transformer';
import { BaseEntity } from '@/shared/domain/base.entity';

export class ReviewReport extends BaseEntity {

  @Expose()
  reviewId!: string;

  @Expose()
  reportedBy!: string;

  @Expose()
  reason!: string;

  @Expose()
  description?: string;

  @Expose()
  status!: string;

  @Expose()
  resolvedBy?: string;

  @Expose()
  resolvedAt?: Date;

  @Expose()
  adminNotes?: string;



  static toDomain(input: unknown): ReviewReport | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const report = new ReviewReport();
    report.id = data.id as string;
    report.reviewId = data.reviewId as string;
    report.reportedBy = data.reportedBy as string;
    report.reason = data.reason as string;
    report.description = data.description as string | undefined;
    report.status = data.status as string;
    report.resolvedBy = data.resolvedBy as string | undefined;
    report.resolvedAt = data.resolvedAt as Date | undefined;
    report.adminNotes = data.adminNotes as string | undefined;
    report.createdAt = data.createdAt as Date;
    report.updatedAt = data.updatedAt as Date;

    return report;
  }
}
