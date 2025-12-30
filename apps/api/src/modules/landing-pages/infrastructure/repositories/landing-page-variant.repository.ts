import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { LandingPageVariant } from '../../domain/entities/landing-page-variant.entity';
import { ILandingPageVariantRepository } from '../../domain/repositories/landing-page-variant.repository.interface';

@Injectable()
export class LandingPageVariantRepository implements ILandingPageVariantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<LandingPageVariant>): Promise<LandingPageVariant> {
    const created = await this.prisma.landingPageVariant.create({
      data: {
        landingPage: { connect: { id: data.landingPageId! } },
        name: data.name!,
        trafficWeight: data.trafficWeight || 50,
        isControl: data.isControl || false,
        isWinner: data.isWinner || false,
        sections: JSON.parse(JSON.stringify(data.sections ?? [])),
        views: data.views || 0,
        conversions: data.conversions || 0,
        conversionRate: data.conversionRate || 0,
      },
    });

    const domain = LandingPageVariant.toDomain(created);
    if (!domain) throw new Error('Failed to convert to domain entity');
    return domain;
  }

  async findById(id: string): Promise<LandingPageVariant | null> {
    const found = await this.prisma.landingPageVariant.findUnique({
      where: { id },
    });
    if (!found) return null;
    return LandingPageVariant.toDomain(found);
  }

  async findByLandingPageId(
    landingPageId: string,
  ): Promise<LandingPageVariant[]> {
    const variants = await this.prisma.landingPageVariant.findMany({
      where: { landingPageId },
      orderBy: { createdAt: SortOrder.ASC },
    });

    return variants
      .map((v) => LandingPageVariant.toDomain(v))
      .filter((v): v is LandingPageVariant => v !== null);
  }

  async update(
    id: string,
    data: Partial<LandingPageVariant>,
  ): Promise<LandingPageVariant> {
    const updated = await this.prisma.landingPageVariant.update({
      where: { id },
      data: {
        name: data.name,
        trafficWeight: data.trafficWeight,
        isControl: data.isControl,
        isWinner: data.isWinner,
        sections: data.sections
          ? JSON.parse(JSON.stringify(data.sections))
          : undefined,
      },
    });

    const domain = LandingPageVariant.toDomain(updated);
    if (!domain) throw new Error('Failed to convert to domain entity');
    return domain;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.landingPageVariant.delete({ where: { id } });
  }

  async selectWinner(id: string): Promise<void> {
    const variant = await this.prisma.landingPageVariant.findUnique({
      where: { id },
    });
    if (!variant) throw new Error('Variant not found');

    // Mark this variant as winner, unmark others
    await Promise.all([
      this.prisma.landingPageVariant.updateMany({
        where: { landingPageId: variant.landingPageId },
        data: { isWinner: false },
      }),
      this.prisma.landingPageVariant.update({
        where: { id },
        data: { isWinner: true },
      }),
    ]);
  }

  async incrementViews(id: string): Promise<void> {
    await this.prisma.landingPageVariant.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  async incrementConversions(id: string): Promise<void> {
    await this.prisma.landingPageVariant.update({
      where: { id },
      data: { conversions: { increment: 1 } },
    });
    await this.updateConversionRate(id);
  }

  async updateConversionRate(id: string): Promise<void> {
    const variant = await this.prisma.landingPageVariant.findUnique({
      where: { id },
    });
    if (!variant) return;

    const rate =
      variant.views > 0 ? (variant.conversions / variant.views) * 100 : 0;

    await this.prisma.landingPageVariant.update({
      where: { id },
      data: { conversionRate: rate },
    });
  }
}
