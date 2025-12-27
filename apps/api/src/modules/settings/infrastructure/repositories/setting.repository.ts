import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Setting } from '../../domain/entities/setting.entity';
import { ISettingRepository } from '../../domain/repositories/setting.repository.interface';

@Injectable()
export class SettingRepository implements ISettingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.SettingCreateInput): Promise<Setting> {
    const result = await this.prisma.setting.create({ data });
    return Setting.toDomain(result)!;
  }

  async findAll(): Promise<Setting[]> {
    const results = await this.prisma.setting.findMany({
      orderBy: { category: SortOrder.ASC },
    });
    return results.map((r) => Setting.toDomain(r)!);
  }

  async findByCategory(category: string): Promise<Setting[]> {
    const results = await this.prisma.setting.findMany({
      where: { category },
      orderBy: { key: SortOrder.ASC },
    });
    return results.map((r) => Setting.toDomain(r)!);
  }

  async findByKey(key: string): Promise<Setting | null> {
    const result = await this.prisma.setting.findUnique({
      where: { key },
    });
    return result ? Setting.toDomain(result) : null;
  }

  async findPublic(): Promise<Setting[]> {
    const results = await this.prisma.setting.findMany({
      where: { isPublic: true },
      orderBy: { category: SortOrder.ASC },
    });
    return results.map((r) => Setting.toDomain(r)!);
  }

  async update(key: string, data: Prisma.SettingUpdateInput): Promise<Setting> {
    const result = await this.prisma.setting.update({
      where: { key },
      data,
    });
    return Setting.toDomain(result)!;
  }

  async delete(key: string): Promise<Setting> {
    const result = await this.prisma.setting.delete({
      where: { key },
    });
    return Setting.toDomain(result)!;
  }
}
