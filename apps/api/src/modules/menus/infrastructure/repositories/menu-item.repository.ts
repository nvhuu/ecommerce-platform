import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { MenuItem, Prisma } from '@prisma/client';
import { IMenuItemRepository } from '../../domain/repositories/menu.repository.interface';

@Injectable()
export class MenuItemRepository implements IMenuItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.MenuItemCreateInput): Promise<MenuItem> {
    return this.prisma.menuItem.create({ data });
  }

  async findById(id: string): Promise<MenuItem | null> {
    return this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: { order: SortOrder.ASC },
        },
      },
    });
  }

  async findByMenuId(menuId: string): Promise<MenuItem[]> {
    return this.prisma.menuItem.findMany({
      where: { menuId },
      orderBy: { order: SortOrder.ASC },
    });
  }

  async update(
    id: string,
    data: Prisma.MenuItemUpdateInput,
  ): Promise<MenuItem> {
    return this.prisma.menuItem.update({ where: { id }, data });
  }

  async delete(id: string): Promise<MenuItem> {
    return this.prisma.menuItem.delete({ where: { id } });
  }

  async reorderItems(
    items: Array<{ id: string; order: number }>,
  ): Promise<void> {
    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.menuItem.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
  }
}
