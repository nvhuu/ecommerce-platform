import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LandingPageAnalytics } from '../../domain/entities/landing-page-analytics.entity';
import {
  AnalyticsSummary,
  ILandingPageAnalyticsRepository,
} from '../../domain/repositories/landing-page-analytics.repository.interface';

@Injectable()
export class LandingPageAnalyticsRepository implements ILandingPageAnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async trackEvent(
    data: Partial<LandingPageAnalytics>,
  ): Promise<LandingPageAnalytics> {
    const created = await this.prisma.landingPageAnalytics.create({
      data: {
        landingPageId: data.landingPageId!,
        variantId: data.variantId,
        eventType: data.eventType!,
        sectionType: data.sectionType,
        conversionGoal: data.conversionGoal,
        userId: data.userId,
        sessionId: data.sessionId,
        ip: data.ip,
        userAgent: data.userAgent,
        metadata: data.metadata as Prisma.InputJsonValue,
      },
    });

    const domain = LandingPageAnalytics.toDomain(created);
    if (!domain) throw new Error('Failed to convert to domain entity');
    return domain;
  }

  async getAnalyticsByPage(landingPageId: string): Promise<AnalyticsSummary> {
    const [viewCount, conversionCount, uniqueVis] = await Promise.all([
      this.prisma.landingPageAnalytics.count({
        where: { landingPageId, eventType: 'VIEW' },
      }),
      this.prisma.landingPageAnalytics.count({
        where: { landingPageId, eventType: 'CONVERSION' },
      }),
      this.prisma.landingPageAnalytics.findMany({
        where: { landingPageId, eventType: 'VIEW' },
        select: { sessionId: true },
        distinct: ['sessionId'],
      }),
    ]);

    const totalViews = viewCount;
    const totalConversions = conversionCount;
    const uniqueVisitors = uniqueVis.filter((v) => v.sessionId).length;
    const conversionRate =
      totalViews > 0 ? (totalConversions / totalViews) * 100 : 0;

    return {
      totalViews,
      totalConversions,
      conversionRate,
      uniqueVisitors,
    };
  }

  async getAnalyticsByVariant(variantId: string): Promise<AnalyticsSummary> {
    const [viewCount, conversionCount, uniqueVis] = await Promise.all([
      this.prisma.landingPageAnalytics.count({
        where: { variantId, eventType: 'VIEW' },
      }),
      this.prisma.landingPageAnalytics.count({
        where: { variantId, eventType: 'CONVERSION' },
      }),
      this.prisma.landingPageAnalytics.findMany({
        where: { variantId, eventType: 'VIEW' },
        select: { sessionId: true },
        distinct: ['sessionId'],
      }),
    ]);

    const totalViews = viewCount;
    const totalConversions = conversionCount;
    const uniqueVisitors = uniqueVis.filter((v) => v.sessionId).length;
    const conversionRate =
      totalViews > 0 ? (totalConversions / totalViews) * 100 : 0;

    return {
      totalViews,
      totalConversions,
      conversionRate,
      uniqueVisitors,
    };
  }

  async getEventsByPage(
    landingPageId: string,
    eventType?: string,
  ): Promise<LandingPageAnalytics[]> {
    const where: Prisma.LandingPageAnalyticsWhereInput = { landingPageId };
    if (eventType) {
      where.eventType = eventType;
    }

    const events = await this.prisma.landingPageAnalytics.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to last 100 events
    });

    return events
      .map((e) => LandingPageAnalytics.toDomain(e))
      .filter((e): e is LandingPageAnalytics => e !== null);
  }
}
