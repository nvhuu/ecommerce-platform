import { LandingPageAnalytics } from '../entities/landing-page-analytics.entity';

export interface AnalyticsSummary {
  totalViews: number;
  totalConversions: number;
  conversionRate: number;
  uniqueVisitors: number;
}

export abstract class ILandingPageAnalyticsRepository {
  abstract trackEvent(
    data: Partial<LandingPageAnalytics>,
  ): Promise<LandingPageAnalytics>;
  abstract getAnalyticsByPage(landingPageId: string): Promise<AnalyticsSummary>;
  abstract getAnalyticsByVariant(variantId: string): Promise<AnalyticsSummary>;
  abstract getEventsByPage(
    landingPageId: string,
    eventType?: string,
  ): Promise<LandingPageAnalytics[]>;
}
