import { Module } from '@nestjs/common';
import { ReviewsService } from '../application/services/reviews.service';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';
import { ReviewRepository } from '../infrastructure/repositories/review.repository';
import { ReviewsController } from '../presentation/controllers/reviews.controller';
import { OrdersModule } from './orders.module'; // If we ever need to check orders

@Module({
  imports: [PrismaModule, OrdersModule],
  controllers: [ReviewsController],
  providers: [
    ReviewsService,
    {
      provide: 'IReviewRepository',
      useClass: ReviewRepository,
    },
    // We might need IOrderRepository if ReviewsService uses it,
    // but OrdersModule exports OrdersService, not the repository directly usually,
    // unless OrdersModule exports the provider.
    // For now ReviewsService injects 'IOrderRepository'.
    // We should check if OrdersModule exports IOrderRepository provider or if we should just import the repo here.
    // OrdersModule exports OrdersService.
    // Let's rely on what OrdersModule exports.
  ],
  exports: [ReviewsService],
})
export class ReviewsModule {}
