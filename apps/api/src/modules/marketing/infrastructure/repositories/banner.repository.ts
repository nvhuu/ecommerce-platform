import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../core/prisma/prisma.service';
import { Banner } from '../../domain/entities/banner.entity';
import { IBannerRepository } from '../../domain/repositories/banner.repository.interface';

@Injectable()
export class BannerRepository implements IBannerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.BannerCreateInput): Promise<Banner> {
    const result = await this.prisma.banner.create({ data });
    return Banner.toDomain(result)!;
  }

  async findAll(filters?: {
    isActive?: boolean;
    position?: string;
  }): Promise<Banner[]> {
    const results = await this.prisma.banner.findMany({
      where: filters,
      orderBy: [{ priority: SortOrder.DESC }, { createdAt: SortOrder.DESC }],
    });
    return results.map((r) => Banner.toDomain(r)!);
  }

  async findById(id: string): Promise<Banner | null> {
    const result = await this.prisma.banner.findUnique({ where: { id } });
    return result ? Banner.toDomain(result) : null;
  }

  async update(id: string, data: Prisma.BannerUpdateInput): Promise<Banner> {
    const result = await this.prisma.banner.update({
      where: { id },
      data,
    });
    return Banner.toDomain(result)!;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.banner.delete({ where: { id } });
  }

  async findActiveByPosition(position: string): Promise<Banner[]> {
    const now = new Date();
    const results = await this.prisma.banner.findMany({
      where: {
        position,
        isActive: true,
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [
          {
            OR: [{ endDate: null }, { endDate: { gte: now } }],
          },
        ],
      },
      orderBy: { priority: SortOrder.DESC },
    });
    return results.map((r) => Banner.toDomain(r)!);
  }

  async trackImpression(id: string): Promise<void> {
    await this.prisma.banner.update({
      where: { id },
      data: {
        impressions: { increment: 1 },
      },
    });
  }

  async trackClick(id: string): Promise<void> {
    await this.prisma.banner.update({
      where: { id },
      data: {
        clicks: { increment: 1 },
      },
    });
  }
}
