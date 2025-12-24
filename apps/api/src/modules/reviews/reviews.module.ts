import { PrismaModule } from '@/core/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { UsersModule } from '../users/users.module';
import { ReviewsService } from './application/services/reviews.service';
import { ReviewRepository } from './infrastructure/repositories/review.repository';
import { ReviewsController } from './presentation/controllers/reviews.controller';

@Module({
  imports: [PrismaModule, OrdersModule, UsersModule],
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
