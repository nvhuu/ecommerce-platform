import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { OrdersModule } from '../orders/orders.module';
import { ReviewsService } from './application/services/reviews.service';
import { ReviewRepository } from './infrastructure/repositories/review.repository';
import { ReviewsController } from './presentation/controllers/reviews.controller';

@Module({
  imports: [PrismaModule, OrdersModule],
  controllers: [ReviewsController],
  providers: [
    ReviewsService,
    {
      provide: 'IReviewRepository',
      useClass: ReviewRepository,
    },
  ],
  exports: [ReviewsService],
})
export class ReviewsModule {}
