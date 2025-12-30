import { MESSAGES } from '@/shared/constants/messages.constant';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LandingPageVariant } from '../../domain/entities/landing-page-variant.entity';
import { LandingPage } from '../../domain/entities/landing-page.entity';
import { ILandingPageAnalyticsRepository } from '../../domain/repositories/landing-page-analytics.repository.interface';
import { ILandingPageVariantRepository } from '../../domain/repositories/landing-page-variant.repository.interface';
import { ILandingPageRepository } from '../../domain/repositories/landing-page.repository.interface';
import {
  CreateLandingPageDto,
  CreateVariantDto,
  TrackEventDto,
  UpdateLandingPageDto,
  UpdateVariantDto,
} from '../dtos/request/landing-page.dto';

@Injectable()
export class LandingPageService {
  constructor(
    @Inject('ILandingPageRepository')
    private readonly landingPageRepository: ILandingPageRepository,
    @Inject('ILandingPageVariantRepository')
    private readonly variantRepository: ILandingPageVariantRepository,
    @Inject('ILandingPageAnalyticsRepository')
    private readonly analyticsRepository: ILandingPageAnalyticsRepository,
  ) {}

  async create(
    dto: CreateLandingPageDto,
    userId?: string,
  ): Promise<LandingPage> {
    // Check if slug exists
    const existing = await this.landingPageRepository.findBySlug(dto.slug);
    if (existing) {
      throw new BadRequestException(MESSAGES.LANDING_PAGE.SLUG_EXISTS);
    }

    return this.landingPageRepository.create({
      ...dto,
      createdBy: userId,
    });
  }

  async findAll(page?: number, limit?: number) {
    return this.landingPageRepository.findAll({ page, limit });
  }

  async findById(id: string): Promise<LandingPage> {
    const page = await this.landingPageRepository.findById(id);
    if (!page) {
      throw new NotFoundException(MESSAGES.LANDING_PAGE.NOT_FOUND);
    }
    return page;
  }

  async findBySlug(slug: string): Promise<LandingPage> {
    const page = await this.landingPageRepository.findBySlug(slug);
    if (!page) {
      throw new NotFoundException(MESSAGES.LANDING_PAGE.NOT_FOUND);
    }
    return page;
  }

  async update(id: string, dto: UpdateLandingPageDto): Promise<LandingPage> {
    await this.findById(id); // Check exists

    // Check slug uniqueness if changing
    if (dto.slug) {
      const existing = await this.landingPageRepository.findBySlug(dto.slug);
      if (existing && existing.id !== id) {
        throw new BadRequestException(MESSAGES.LANDING_PAGE.SLUG_EXISTS);
      }
    }

    return this.landingPageRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Check exists
    await this.landingPageRepository.delete(id);
  }

  async publish(id: string): Promise<LandingPage> {
    await this.findById(id); // Check exists
    return this.landingPageRepository.publish(id);
  }

  async archive(id: string): Promise<LandingPage> {
    await this.findById(id); // Check exists
    return this.landingPageRepository.archive(id);
  }

  // ========== Variant Management ==========

  async createVariant(
    pageId: string,
    dto: CreateVariantDto,
  ): Promise<LandingPageVariant> {
    await this.findById(pageId); // Check page exists

    return this.variantRepository.create({
      landingPageId: pageId,
      ...dto,
    });
  }

  async getVariants(pageId: string): Promise<LandingPageVariant[]> {
    await this.findById(pageId); // Check page exists
    return this.variantRepository.findByLandingPageId(pageId);
  }

  async updateVariant(
    variantId: string,
    dto: UpdateVariantDto,
  ): Promise<LandingPageVariant> {
    const variant = await this.variantRepository.findById(variantId);
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    return this.variantRepository.update(variantId, dto);
  }

  async deleteVariant(variantId: string): Promise<void> {
    const variant = await this.variantRepository.findById(variantId);
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    await this.variantRepository.delete(variantId);
  }

  async selectWinner(variantId: string): Promise<void> {
    const variant = await this.variantRepository.findById(variantId);
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    // Copy winner sections to main landing page
    await this.landingPageRepository.update(variant.landingPageId, {
      sections: variant.sections,
      isAbTest: false, // End A/B test
    });

    // Mark variant as winner
    await this.variantRepository.selectWinner(variantId);
  }

  // ========== A/B Testing Logic ==========

  async getVariantForUser(
    pageId: string,
    _sessionId: string,
  ): Promise<LandingPageVariant | null> {
    const page = await this.findById(pageId);

    if (!page.isAbTest) {
      return null; // No A/B test, use main page
    }

    const variants = await this.variantRepository.findByLandingPageId(pageId);
    if (variants.length === 0) {
      return null; // No variants, use main page
    }

    // Weighted random selection based on traffic weight
    const totalWeight = variants.reduce((sum, v) => sum + v.trafficWeight, 0);
    const random = Math.random() * totalWeight;

    let cumulative = 0;
    for (const variant of variants) {
      cumulative += variant.trafficWeight;
      if (random <= cumulative) {
        // Track view for this variant
        await this.variantRepository.incrementViews(variant.id);
        return variant;
      }
    }

    return variants[0] ?? null; // Fallback to first variant or null
  }

  // ========== Analytics ==========

  async trackEvent(
    pageId: string,
    dto: TrackEventDto,
    userId?: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.findById(pageId); // Check page exists

    await this.analyticsRepository.trackEvent({
      landingPageId: pageId,
      eventType: dto.eventType,
      sectionType: dto.sectionType,
      conversionGoal: dto.conversionGoal,
      userId,
      sessionId: dto.sessionId,
      ip,
      userAgent,
      metadata: dto.metadata,
    });

    // Update counters
    if (dto.eventType === 'VIEW') {
      await this.landingPageRepository.incrementViews(pageId);
    } else if (dto.eventType === 'CONVERSION') {
      await this.landingPageRepository.incrementConversions(pageId);
    }
  }

  async getAnalytics(pageId: string) {
    await this.findById(pageId); // Check page exists
    return this.analyticsRepository.getAnalyticsByPage(pageId);
  }

  async getAbTestResults(pageId: string) {
    const page = await this.findById(pageId);
    const variants = await this.variantRepository.findByLandingPageId(pageId);

    const results = await Promise.all(
      variants.map(async (variant) => {
        const analytics = await this.analyticsRepository.getAnalyticsByVariant(
          variant.id,
        );
        return {
          variantId: variant.id,
          variantName: variant.name,
          views: analytics.totalViews,
          conversions: analytics.totalConversions,
          conversionRate: analytics.conversionRate,
          isControl: variant.isControl,
          isWinner: variant.isWinner,
        };
      }),
    );

    // Find best performer
    const bestPerformer = results.reduce((best, current) =>
      current.conversionRate > best.conversionRate ? current : best,
    );

    return {
      landingPageId: page.id,
      variants: results,
      bestPerformer,
    };
  }
}
