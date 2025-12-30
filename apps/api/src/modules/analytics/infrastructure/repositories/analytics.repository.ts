import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  AbandonmentStatus,
  CartAbandonment,
} from '../../domain/entities/cart-abandonment.entity';
import { CheckoutStep } from '../../domain/entities/checkout-step.entity';
import { ProductView } from '../../domain/entities/product-view.entity';
import { SearchLog } from '../../domain/entities/search-log.entity';
import type {
  CheckoutFunnelStats,
  ProductViewStats,
  SearchStats,
} from '../../domain/repositories/analytics.repository.interface';
import { IAnalyticsRepository } from '../../domain/repositories/analytics.repository.interface';

@Injectable()
export class AnalyticsRepository implements IAnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async trackProductView(data: Partial<ProductView>): Promise<ProductView> {
    const created = await this.prisma.productView.create({
      data: {
        productId: data.productId!,
        userId: data.userId,
        sessionId: data.sessionId!,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
        referrer: data.referrer,
        viewedAt: data.viewedAt || new Date(),
      },
    });

    const domain = ProductView.toDomain(created);
    if (!domain) throw new Error('Failed to convert to domain entity');
    return domain;
  }

  async trackSearch(data: Partial<SearchLog>): Promise<SearchLog> {
    const created = await this.prisma.searchLog.create({
      data: {
        query: data.query!,
        userId: data.userId,
        sessionId: data.sessionId!,
        resultsCount: data.resultsCount || 0,
        clickedResults: data.clickedResults || [],
        filters: data.filters ? JSON.parse(JSON.stringify(data.filters)) : null,
        sortBy: data.sortBy,
        searchedAt: data.searchedAt || new Date(),
      },
    });

    const domain = SearchLog.toDomain(created);
    if (!domain) throw new Error('Failed to convert to domain entity');
    return domain;
  }

  async trackCheckoutStep(data: Partial<CheckoutStep>): Promise<CheckoutStep> {
    const created = await this.prisma.checkoutStep.create({
      data: {
        orderId: data.orderId,
        userId: data.userId,
        sessionId: data.sessionId!,
        stepType: data.stepType!,
        stepData: data.stepData
          ? JSON.parse(JSON.stringify(data.stepData))
          : null,
        completedAt: data.completedAt || new Date(),
      },
    });

    const domain = CheckoutStep.toDomain(created);
    if (!domain) throw new Error('Failed to convert to domain entity');
    return domain;
  }

  async trackCartAbandonment(
    data: Partial<CartAbandonment>,
  ): Promise<CartAbandonment> {
    const created = await this.prisma.cartAbandonment.create({
      data: {
        userId: data.userId,
        sessionId: data.sessionId!,
        email: data.email,
        cartItems: JSON.parse(JSON.stringify(data.cartItems || [])),
        cartTotal: data.cartTotal || 0,
        status: data.status || AbandonmentStatus.ABANDONED,
        recoveryEmailsSent: data.recoveryEmailsSent || 0,
        abandonedAt: data.abandonedAt || new Date(),
      },
    });

    const domain = CartAbandonment.toDomain(created);
    if (!domain) throw new Error('Failed to convert to domain entity');
    return domain;
  }

  async getProductViewStats(
    productId: string,
    days: number,
  ): Promise<ProductViewStats> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [totalViews, uniqueUsers, viewsByDay] = await Promise.all([
      this.prisma.productView.count({
        where: {
          productId,
          viewedAt: { gte: startDate },
        },
      }),
      this.prisma.productView.groupBy({
        by: ['userId'],
        where: {
          productId,
          viewedAt: { gte: startDate },
          userId: { not: null },
        },
      }),
      this.prisma.productView.groupBy({
        by: ['viewedAt'],
        _count: true,
        where: {
          productId,
          viewedAt: { gte: startDate },
        },
      }),
    ]);

    return {
      productId,
      totalViews,
      uniqueUsers: uniqueUsers.length,
      viewsByDay: viewsByDay.map((v) => ({
        date: (v.viewedAt ? v.viewedAt.toISOString().split('T')[0] : '') || '',
        count: v._count || 0,
      })),
    };
  }

  async getSearchStats(days: number): Promise<SearchStats> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [totalSearches, topQueries, noResults] = await Promise.all([
      this.prisma.searchLog.count({
        where: { searchedAt: { gte: startDate } },
      }),
      this.prisma.searchLog.groupBy({
        by: ['query'],
        _count: true,
        where: { searchedAt: { gte: startDate } },
        orderBy: { _count: { query: 'desc' } },
        take: 10,
      }),
      this.prisma.searchLog.findMany({
        where: {
          searchedAt: { gte: startDate },
          resultsCount: 0,
        },
        select: { query: true },
        distinct: ['query'],
        take: 20,
      }),
    ]);

    const avgResults = await this.prisma.searchLog.aggregate({
      _avg: { resultsCount: true },
      where: { searchedAt: { gte: startDate } },
    });

    return {
      totalSearches,
      uniqueQueries: topQueries.length,
      avgResultsCount: avgResults._avg.resultsCount || 0,
      topQueries: topQueries.map((q) => ({
        query: q.query,
        count: q._count,
      })),
      noResultQueries: noResults.map((r) => r.query),
    };
  }

  async getCheckoutFunnel(days: number): Promise<CheckoutFunnelStats> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const steps = await this.prisma.checkoutStep.groupBy({
      by: ['stepType'],
      _count: true,
      where: { completedAt: { gte: startDate } },
    });

    const stats = {
      cartView: 0,
      shippingInfo: 0,
      paymentInfo: 0,
      orderReview: 0,
      orderComplete: 0,
      conversionRate: 0,
    };

    steps.forEach((step) => {
      switch (step.stepType) {
        case 'CART_VIEW':
          stats.cartView = step._count;
          break;
        case 'SHIPPING_INFO':
          stats.shippingInfo = step._count;
          break;
        case 'PAYMENT_INFO':
          stats.paymentInfo = step._count;
          break;
        case 'ORDER_REVIEW':
          stats.orderReview = step._count;
          break;
        case 'ORDER_COMPLETE':
          stats.orderComplete = step._count;
          break;
      }
    });

    stats.conversionRate =
      stats.cartView > 0 ? (stats.orderComplete / stats.cartView) * 100 : 0;

    return stats;
  }

  async getAbandonedCarts(
    status: AbandonmentStatus,
  ): Promise<CartAbandonment[]> {
    const carts = await this.prisma.cartAbandonment.findMany({
      where: { status },
      orderBy: { abandonedAt: 'desc' },
      take: 100,
    });

    return carts
      .map((cart) => CartAbandonment.toDomain(cart))
      .filter((cart): cart is CartAbandonment => cart !== null);
  }

  async getAbandonedCartsForRecovery(
    hoursAgo: number,
    maxEmailsSent: number,
  ): Promise<CartAbandonment[]> {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hoursAgo);

    const carts = await this.prisma.cartAbandonment.findMany({
      where: {
        status: AbandonmentStatus.ABANDONED,
        abandonedAt: { lte: cutoffTime },
        recoveryEmailsSent: { lt: maxEmailsSent },
        email: { not: null },
      },
      orderBy: { abandonedAt: 'asc' },
    });

    return carts
      .map((cart) => CartAbandonment.toDomain(cart))
      .filter((cart): cart is CartAbandonment => cart !== null);
  }

  async updateCartAbandonment(
    id: string,
    data: Partial<CartAbandonment>,
  ): Promise<CartAbandonment> {
    const updated = await this.prisma.cartAbandonment.update({
      where: { id },
      data: {
        status: data.status,
        recoveryEmailsSent: data.recoveryEmailsSent,
        lastEmailSentAt: data.lastEmailSentAt,
        recoveredAt: data.recoveredAt,
        expiredAt: data.expiredAt,
      },
    });

    const domain = CartAbandonment.toDomain(updated);
    if (!domain) throw new Error('Failed to convert to domain entity');
    return domain;
  }

  async markCartRecovered(id: string): Promise<void> {
    await this.prisma.cartAbandonment.update({
      where: { id },
      data: {
        status: AbandonmentStatus.RECOVERED,
        recoveredAt: new Date(),
      },
    });
  }
}
