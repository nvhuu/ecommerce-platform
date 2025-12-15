import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from '../../application/services/reviews.service';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req: { user: { id: string } },
    @Body() body: { productId: string; rating: number; comment?: string },
  ) {
    return this.reviewsService.create(
      req.user.id,
      body.productId,
      body.rating,
      body.comment,
    );
  }

  @Get('product/:productId')
  async findAllByProduct(@Param('productId') productId: string) {
    const reviews = await this.reviewsService.findAllByProduct(productId);
    return { data: reviews };
  }
}
