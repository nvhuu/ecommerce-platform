import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import {
  LandingPage,
  LandingPageStatus,
} from '../../domain/entities/landing-page.entity';
import {
  ILandingPageRepository,
  PaginatedResult,
  PaginationOptions,
} from '../../domain/repositories/landing-page.repository.interface';

@Injectable()
export class LandingPageRepository implements ILandingPageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<LandingPage>): Promise<LandingPage> {
    const created = await this.prisma.landingPage.create({
      data: {
        name: data.name!,
        slug: data.slug!,
        description: data.description,
        status: data.status || LandingPageStatus.DRAFT,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords || [],
        sections: JSON.parse(JSON.stringify(data.sections ?? [])),
        isAbTest: data.isAbTest || false,
        views: data.views || 0,
        conversions: data.conversions || 0,
        conversionGoals: data.conversionGoals
          ? JSON.parse(JSON.stringify(data.conversionGoals))
          : null,
        createdBy: data.createdBy,
      },
    });

    const domain = LandingPage.toDomain(created);
    if (!domain) throw new Error('Failed to convert to domain entity');
    return domain;
  }

  async findById(id: string): Promise<LandingPage | null> {
    const found = await this.prisma.landingPage.findUnique({ where: { id } });
    if (!found) return null;
    return LandingPage.toDomain(found);
  }

  async findBySlug(slug: string): Promise<LandingPage | null> {
    const found = await this.prisma.landingPage.findUnique({ where: { slug } });
    if (!found) return null;
    return LandingPage.toDomain(found);
  }

  async findAll(
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<LandingPage>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;
    const sortOrder =
      pagination.sortOrder === SortOrder.ASC ? SortOrder.ASC : SortOrder.DESC;

    const [items, total] = await Promise.all([
      this.prisma.landingPage.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: sortOrder },
      }),
      this.prisma.landingPage.count(),
    ]);

    const data = items
      .map((item) => LandingPage.toDomain(item))
      .filter((item): item is LandingPage => item !== null);

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, data: Partial<LandingPage>): Promise<LandingPage> {
    const updated = await this.prisma.landingPage.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        status: data.status,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords,
        sections: data.sections
          ? JSON.parse(JSON.stringify(data.sections))
          : undefined,
        isAbTest: data.isAbTest,
        conversionGoals: data.conversionGoals
          ? JSON.parse(JSON.stringify(data.conversionGoals))
          : undefined,
      },
    });

    const domain = LandingPage.toDomain(updated);
    if (!domain) throw new Error('Failed to convert to domain entity');
    return domain;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.landingPage.delete({ where: { id } });
  }

  async publish(id: string): Promise<LandingPage> {
    const updated = await this.prisma.landingPage.update({
      where: { id },
      data: {
        status: LandingPageStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });

    const domain = LandingPage.toDomain(updated);
    if (!domain) throw new Error('Failed to convert to domain entity');
    return domain;
  }

  async archive(id: string): Promise<LandingPage> {
    const updated = await this.prisma.landingPage.update({
      where: { id },
      data: { status: LandingPageStatus.ARCHIVED },
    });

    const domain = LandingPage.toDomain(updated);
    if (!domain) throw new Error('Failed to convert to domain entity');
    return domain;
  }

  async incrementViews(id: string): Promise<void> {
    await this.prisma.landingPage.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  async incrementConversions(id: string): Promise<void> {
    await this.prisma.landingPage.update({
      where: { id },
      data: { conversions: { increment: 1 } },
    });
  }
}
