import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { Menu, MenuLocation, Prisma } from '@prisma/client';
import { IMenuRepository } from '../../domain/repositories/menu.repository.interface';

@Injectable()
export class MenuRepository implements IMenuRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.MenuCreateInput): Promise<Menu> {
    return this.prisma.menu.create({ data });
  }

  async findAll(): Promise<Menu[]> {
    return this.prisma.menu.findMany({
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
  }

  async findById(id: string) {
    return this.prisma.menu.findUnique({
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
  }

  // Alias for findById - both return items
  async findByIdWithItems(id: string): Promise<Menu | null> {
    return this.findById(id);
  }

  async findByLocation(location: string): Promise<Menu | null> {
    return this.prisma.menu.findUnique({
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
  }

  async update(id: string, data: Prisma.MenuUpdateInput): Promise<Menu> {
    return this.prisma.menu.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Menu> {
    return this.prisma.menu.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
