import { Injectable } from '@nestjs/common';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../core/prisma/prisma.service';
import { Popup } from '../../domain/entities/popup.entity';
import { IPopupRepository } from '../../domain/repositories/popup.repository.interface';

@Injectable()
export class PopupRepository implements IPopupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PopupCreateInput): Promise<Popup> {
    const result = await this.prisma.popup.create({ data });
    return Popup.toDomain(result)!;
  }

  async findAll(filters?: {
    isActive?: boolean;
    type?: string;
  }): Promise<Popup[]> {
    const results = await this.prisma.popup.findMany({
      where: filters,
      orderBy: { createdAt: SortOrder.DESC },
    });
    return results.map((r) => Popup.toDomain(r)!);
  }

  async findById(id: string): Promise<Popup | null> {
    const result = await this.prisma.popup.findUnique({ where: { id } });
    return result ? Popup.toDomain(result) : null;
  }

  async update(id: string, data: Prisma.PopupUpdateInput): Promise<Popup> {
    const result = await this.prisma.popup.update({
      where: { id },
      data,
    });
    return Popup.toDomain(result)!;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.popup.delete({ where: { id } });
  }

  async findActivePopups(): Promise<Popup[]> {
    const now = new Date();
    const results = await this.prisma.popup.findMany({
      where: {
        isActive: true,
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [
          {
            OR: [{ endDate: null }, { endDate: { gte: now } }],
          },
        ],
      },
      orderBy: { createdAt: SortOrder.DESC },
    });
    return results.map((r) => Popup.toDomain(r)!);
  }

  async trackImpression(id: string): Promise<void> {
    await this.prisma.popup.update({
      where: { id },
      data: {
        impressions: { increment: 1 },
      },
    });
  }

  async trackConversion(id: string): Promise<void> {
    await this.prisma.popup.update({
      where: { id },
      data: {
        conversions: { increment: 1 },
      },
    });
  }

  async trackDismiss(id: string): Promise<void> {
    await this.prisma.popup.update({
      where: { id },
      data: {
        interactions: { increment: 1 }, // Using interactions for dismiss tracking
      },
    });
  }
}
