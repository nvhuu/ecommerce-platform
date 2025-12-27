import { Expose, Type } from 'class-transformer';

class ReporterDto {
  @Expose()
  id!: string;

  @Expose()
  email!: string;
}

export class ReviewReportResponseDto {
  @Expose()
  id!: string;

  @Expose()
  reviewId!: string;

  @Expose()
  @Type(() => ReporterDto)
  reporter!: ReporterDto;

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
  resolution?: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
