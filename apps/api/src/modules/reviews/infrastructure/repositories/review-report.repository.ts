import { Injectable } from '@nestjs/common';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../core/prisma/prisma.service';
import { ReviewReport } from '../../domain/entities/review-report.entity';
import { IReviewReportRepository } from '../../domain/repositories/review-report.repository.interface';

@Injectable()
export class ReviewReportRepository implements IReviewReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ReviewReportCreateInput): Promise<ReviewReport> {
    const result = await this.prisma.reviewReport.create({ data });
    return ReviewReport.toDomain(result)!;
  }

  async findAll(filters?: {
    status?: string;
    reviewId?: string;
  }): Promise<ReviewReport[]> {
    const results = await this.prisma.reviewReport.findMany({
      where: filters,
      include: {
        review: {
          include: {
            product: true,
            user: true,
          },
        },
        reporter: true,
        resolver: true,
      },
      orderBy: { createdAt: SortOrder.DESC },
    });
    return results.map((r) => ReviewReport.toDomain(r)!);
  }

  async findById(id: string): Promise<ReviewReport | null> {
    const result = await this.prisma.reviewReport.findUnique({
      where: { id },
      include: {
        review: {
          include: {
            product: true,
            user: true,
          },
        },
        reporter: true,
        resolver: true,
      },
    });
    return result ? ReviewReport.toDomain(result) : null;
  }

  async update(
    id: string,
    data: Prisma.ReviewReportUpdateInput,
  ): Promise<ReviewReport> {
    const result = await this.prisma.reviewReport.update({
      where: { id },
      data,
    });
    return ReviewReport.toDomain(result)!;
  }

  async findPending(): Promise<ReviewReport[]> {
    const results = await this.prisma.reviewReport.findMany({
      where: { status: 'pending' },
      include: {
        review: {
          include: {
            product: true,
            user: true,
          },
        },
        reporter: true,
      },
      orderBy: { createdAt: SortOrder.ASC },
    });
    return results.map((r) => ReviewReport.toDomain(r)!);
  }

  async countByReview(reviewId: string): Promise<number> {
    return this.prisma.reviewReport.count({
      where: { reviewId },
    });
  }
}
