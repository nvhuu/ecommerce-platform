import { PrismaModule } from '@/core/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { UsersModule } from '../users/users.module';
import { ReviewModerationService } from './application/services/review-moderation.service';
import { ReviewsService } from './application/services/reviews.service';
import { REVIEW_REPORT_REPOSITORY_TOKEN } from './domain/repositories/review-report.repository.interface';
import { ReviewReportRepository } from './infrastructure/repositories/review-report.repository';
import { ReviewRepository } from './infrastructure/repositories/review.repository';
import { ReviewModerationController } from './presentation/controllers/review-moderation.controller';
import { ReviewsController } from './presentation/controllers/reviews.controller';

@Module({
  imports: [PrismaModule, OrdersModule, UsersModule],
  controllers: [ReviewsController, ReviewModerationController],
  providers: [
    ReviewsService,
    ReviewModerationService,
    {
      provide: 'IReviewRepository',
      useClass: ReviewRepository,
    },
    {
      provide: REVIEW_REPORT_REPOSITORY_TOKEN,
      useClass: ReviewReportRepository,
    },
  ],
  exports: [ReviewsService, ReviewModerationService],
})
export class ReviewsModule {}
