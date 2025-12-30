import { Inject, Injectable } from '@nestjs/common';
import {
  AbandonmentStatus,
  CartAbandonment,
} from '../../domain/entities/cart-abandonment.entity';
import {
  CheckoutStep,
  CheckoutStepType,
} from '../../domain/entities/checkout-step.entity';
import { ProductView } from '../../domain/entities/product-view.entity';
import { SearchLog } from '../../domain/entities/search-log.entity';
import { IAnalyticsRepository } from '../../domain/repositories/analytics.repository.interface';
import {
  TrackCartAbandonmentDto,
  TrackCheckoutStepDto,
  TrackProductViewDto,
  TrackSearchDto,
} from '../dtos/request/analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject('IAnalyticsRepository')
    private readonly analyticsRepository: IAnalyticsRepository,
  ) {}

  async trackProductView(dto: TrackProductViewDto): Promise<ProductView> {
    return this.analyticsRepository.trackProductView({
      productId: dto.productId,
      userId: dto.userId,
      sessionId: dto.sessionId,
      userAgent: dto.userAgent,
      ipAddress: dto.ipAddress,
      referrer: dto.referrer,
    });
  }

  async trackSearch(dto: TrackSearchDto): Promise<SearchLog> {
    return this.analyticsRepository.trackSearch({
      query: dto.query,
      userId: dto.userId,
      sessionId: dto.sessionId,
      resultsCount: dto.resultsCount,
      clickedResults: dto.clickedResults,
      filters: dto.filters,
      sortBy: dto.sortBy,
    });
  }

  async trackCheckoutStep(dto: TrackCheckoutStepDto): Promise<CheckoutStep> {
    const stepType = dto.stepType as CheckoutStepType;
    return this.analyticsRepository.trackCheckoutStep({
      stepType,
      orderId: dto.orderId,
      userId: dto.userId,
      sessionId: dto.sessionId,
      stepData: dto.stepData,
    });
  }

  async trackCartAbandonment(
    dto: TrackCartAbandonmentDto,
  ): Promise<CartAbandonment> {
    return this.analyticsRepository.trackCartAbandonment({
      userId: dto.userId,
      sessionId: dto.sessionId,
      email: dto.email,
      cartItems: dto.cartItems,
      cartTotal: dto.cartTotal,
    });
  }

  async markCartRecovered(abandonmentId: string): Promise<void> {
    return this.analyticsRepository.markCartRecovered(abandonmentId);
  }

  async getProductViewAnalytics(productId: string, days = 30) {
    return this.analyticsRepository.getProductViewStats(productId, days);
  }

  async getSearchAnalytics(days = 30) {
    return this.analyticsRepository.getSearchStats(days);
  }

  async getCheckoutFunnelAnalytics(days = 30) {
    return this.analyticsRepository.getCheckoutFunnel(days);
  }

  async getAbandonedCarts(
    status: AbandonmentStatus = AbandonmentStatus.ABANDONED,
  ) {
    return this.analyticsRepository.getAbandonedCarts(status);
  }

  async getAbandonmentStats() {
    const [abandoned, recovered, expired] = await Promise.all([
      this.analyticsRepository.getAbandonedCarts(AbandonmentStatus.ABANDONED),
      this.analyticsRepository.getAbandonedCarts(AbandonmentStatus.RECOVERED),
      this.analyticsRepository.getAbandonedCarts(AbandonmentStatus.EXPIRED),
    ]);

    return {
      total: abandoned.length + recovered.length + expired.length,
      abandoned: abandoned.length,
      recovered: recovered.length,
      expired: expired.length,
      recoveryRate:
        recovered.length > 0
          ? (recovered.length /
              (recovered.length + abandoned.length + expired.length)) *
            100
          : 0,
    };
  }
}
