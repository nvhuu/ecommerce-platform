import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import {
  TrackCartAbandonmentDto,
  TrackCheckoutStepDto,
  TrackProductViewDto,
  TrackSearchDto,
} from '../application/dtos/request/analytics.dto';
import {
  CartAbandonmentDto,
  CheckoutFunnelDto,
  ProductViewStatsDto,
  SearchStatsDto,
} from '../application/dtos/response/analytics.response.dto';
import { AnalyticsService } from '../application/services/analytics.service';
import { CartRecoveryService } from '../application/services/cart-recovery.service';
import { AbandonmentStatus } from '../domain/entities/cart-abandonment.entity';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly cartRecoveryService: CartRecoveryService,
  ) {}

  // ========== Public Tracking Endpoints ==========

  @Post('product-view')
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackProductView(@Body() dto: TrackProductViewDto): Promise<void> {
    await this.analyticsService.trackProductView(dto);
  }

  @Post('search')
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackSearch(@Body() dto: TrackSearchDto): Promise<void> {
    await this.analyticsService.trackSearch(dto);
  }

  @Post('checkout-step')
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackCheckoutStep(@Body() dto: TrackCheckoutStepDto): Promise<void> {
    await this.analyticsService.trackCheckoutStep(dto);
  }

  @Post('cart-abandonment')
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackCartAbandonment(
    @Body() dto: TrackCartAbandonmentDto,
  ): Promise<void> {
    await this.analyticsService.trackCartAbandonment(dto);
  }

  // ========== Admin Analytics Endpoints ==========

  @Get('product/:id/views')
  @Roles(Role.SUPERADMIN)
  @Serialize(ProductViewStatsDto)
  async getProductViews(
    @Param('id') productId: string,
    @Query('days') days?: string,
  ) {
    return this.analyticsService.getProductViewAnalytics(
      productId,
      days ? parseInt(days, 10) : 30,
    );
  }

  @Get('search-trends')
  @Roles(Role.SUPERADMIN)
  @Serialize(SearchStatsDto)
  async getSearchTrends(@Query('days') days?: string) {
    return this.analyticsService.getSearchAnalytics(
      days ? parseInt(days, 10) : 30,
    );
  }

  @Get('checkout-funnel')
  @Roles(Role.SUPERADMIN)
  @Serialize(CheckoutFunnelDto)
  async getCheckoutFunnel(@Query('days') days?: string) {
    return this.analyticsService.getCheckoutFunnelAnalytics(
      days ? parseInt(days, 10) : 30,
    );
  }

  @Get('abandoned-carts')
  @Roles(Role.SUPERADMIN)
  @Serialize(CartAbandonmentDto)
  async getAbandonedCarts(@Query('status') status?: string) {
    return this.analyticsService.getAbandonedCarts(
      (status as AbandonmentStatus) || AbandonmentStatus.ABANDONED,
    );
  }

  @Post('abandoned-carts/:id/recover')
  @Roles(Role.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  async triggerRecovery(@Param('id') id: string) {
    await this.cartRecoveryService.sendManualRecoveryEmail(id);
    return { message: 'Recovery email sent successfully' };
  }

  @Get('stats/abandonment')
  @Roles(Role.SUPERADMIN)
  async getAbandonmentStats() {
    return this.analyticsService.getAbandonmentStats();
  }
}
