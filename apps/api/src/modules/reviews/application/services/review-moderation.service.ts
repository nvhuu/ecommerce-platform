import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewReport } from '../../domain/entities/review-report.entity';
import {
  IReviewReportRepository,
  REVIEW_REPORT_REPOSITORY_TOKEN,
} from '../../domain/repositories/review-report.repository.interface';
import { CreateReportDto } from '../dtos/create-report.dto';
import { ResolveReportDto } from '../dtos/resolve-report.dto';

@Injectable()
export class ReviewModerationService {
  constructor(
    @Inject(REVIEW_REPORT_REPOSITORY_TOKEN)
    private readonly reviewReportRepository: IReviewReportRepository,
  ) {}

  async reportReview(
    dto: CreateReportDto,
    reportedBy: string,
  ): Promise<ReviewReport> {
    return this.reviewReportRepository.create({
      review: { connect: { id: dto.reviewId } },
      reporter: { connect: { id: reportedBy } },
      reason: dto.reason,
      description: dto.description,
    });
  }

  async getReports(filters?: {
    status?: string;
    reviewId?: string;
  }): Promise<ReviewReport[]> {
    return this.reviewReportRepository.findAll(filters);
  }

  async getPendingReports(): Promise<ReviewReport[]> {
    return this.reviewReportRepository.findPending();
  }

  async getReportById(id: string): Promise<ReviewReport> {
    const report = await this.reviewReportRepository.findById(id);
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  async resolveReport(
    id: string,
    dto: ResolveReportDto,
    resolvedBy: string,
  ): Promise<ReviewReport> {
    const report = await this.getReportById(id);

    if (report.status !== 'pending') {
      throw new Error('Report has already been processed');
    }

    return this.reviewReportRepository.update(id, {
      status: 'resolved',
      resolver: { connect: { id: resolvedBy } },
      resolvedAt: new Date(),
      resolution: dto.adminNotes,
    });
  }

  async dismissReport(id: string, resolvedBy: string): Promise<ReviewReport> {
    const report = await this.getReportById(id);

    if (report.status !== 'pending') {
      throw new Error('Report has already been processed');
    }

    return this.reviewReportRepository.update(id, {
      status: 'dismissed',
      resolver: { connect: { id: resolvedBy } },
      resolvedAt: new Date(),
      resolution: 'Dismissed as invalid',
    });
  }
}
