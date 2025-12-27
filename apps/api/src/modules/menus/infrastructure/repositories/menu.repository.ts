import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { MenuLocation, Prisma } from '@prisma/client';
import { Menu } from '../../domain/entities/menu.entity';
import { IMenuRepository } from '../../domain/repositories/menu.repository.interface';

@Injectable()
export class MenuRepository implements IMenuRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.MenuCreateInput): Promise<Menu> {
    const result = await this.prisma.menu.create({ data });
    return Menu.toDomain(result)!;
  }

  async findAll(): Promise<Menu[]> {
    const results = await this.prisma.menu.findMany({
      include: {
        items: {
          where: { parentId: null },
          orderBy: { order: SortOrder.ASC },
          include: {
            children: {
              orderBy: { order: SortOrder.ASC },
              include: {
                children: {
                  orderBy: { order: SortOrder.ASC },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: SortOrder.DESC },
    });
    return results.map((r) => Menu.toDomain(r)!);
  }

  async findById(id: string): Promise<Menu | null> {
    const result = await this.prisma.menu.findUnique({
      where: { id },
      include: {
        items: {
          where: { parentId: null },
          orderBy: { order: SortOrder.ASC },
          include: {
            children: {
              orderBy: { order: SortOrder.ASC },
              include: {
                children: {
                  orderBy: { order: SortOrder.ASC },
                },
              },
            },
          },
        },
      },
    });
    return result ? Menu.toDomain(result) : null;
  }

  // Alias for findById - both return items
  async findByIdWithItems(id: string): Promise<Menu | null> {
    return this.findById(id);
  }

  async findByLocation(location: string): Promise<Menu | null> {
    const result = await this.prisma.menu.findUnique({
      where: { location: location as MenuLocation },
      include: {
        items: {
          where: { parentId: null, isActive: true },
          orderBy: { order: SortOrder.ASC },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { order: SortOrder.ASC },
              include: {
                children: {
                  where: { isActive: true },
                  orderBy: { order: SortOrder.ASC },
                },
              },
            },
          },
        },
      },
    });
    return result ? Menu.toDomain(result) : null;
  }

  async update(id: string, data: Prisma.MenuUpdateInput): Promise<Menu> {
    const result = await this.prisma.menu.update({ where: { id }, data });
    return Menu.toDomain(result)!;
  }

  async delete(id: string): Promise<Menu> {
    // Soft delete
    const result = await this.prisma.menu.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return Menu.toDomain(result)!;
  }
}
