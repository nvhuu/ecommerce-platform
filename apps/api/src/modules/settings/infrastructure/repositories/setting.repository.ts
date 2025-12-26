import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, Setting } from '@prisma/client';
import { ISettingRepository } from '../../domain/repositories/setting.repository.interface';

@Injectable()
export class SettingRepository implements ISettingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.SettingCreateInput): Promise<Setting> {
    return this.prisma.setting.create({ data });
  }

  async findAll(): Promise<Setting[]> {
    return this.prisma.setting.findMany({
      orderBy: { category: 'asc' },
    });
  }

  async findByCategory(category: string): Promise<Setting[]> {
    return this.prisma.setting.findMany({
      where: { category },
      orderBy: { key: 'asc' },
    });
  }

  async findByKey(key: string): Promise<Setting | null> {
    return this.prisma.setting.findUnique({
      where: { key },
    });
  }

  async findPublic(): Promise<Setting[]> {
    return this.prisma.setting.findMany({
      where: { isPublic: true },
      orderBy: { category: 'asc' },
    });
  }

  async update(key: string, data: Prisma.SettingUpdateInput): Promise<Setting> {
    return this.prisma.setting.update({
      where: { key },
      data,
    });
  }

  async delete(key: string): Promise<Setting> {
    return this.prisma.setting.delete({
      where: { key },
    });
  }
}
