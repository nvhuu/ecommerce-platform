import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { MenuItem } from '../../domain/entities/menu-item.entity';
import { IMenuItemRepository } from '../../domain/repositories/menu.repository.interface';

@Injectable()
export class MenuItemRepository implements IMenuItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.MenuItemCreateInput): Promise<MenuItem> {
    const result = await this.prisma.menuItem.create({ data });
    return MenuItem.toDomain(result)!;
  }

  async findById(id: string): Promise<MenuItem | null> {
    const result = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: { order: SortOrder.ASC },
        },
      },
    });
    return result ? MenuItem.toDomain(result) : null;
  }

  async findByMenuId(menuId: string): Promise<MenuItem[]> {
    const results = await this.prisma.menuItem.findMany({
      where: { menuId },
      orderBy: { order: SortOrder.ASC },
    });
    return results.map((r) => MenuItem.toDomain(r)!);
  }

  async update(
    id: string,
    data: Prisma.MenuItemUpdateInput,
  ): Promise<MenuItem> {
    const result = await this.prisma.menuItem.update({ where: { id }, data });
    return MenuItem.toDomain(result)!;
  }

  async delete(id: string): Promise<MenuItem> {
    const result = await this.prisma.menuItem.delete({ where: { id } });
    return MenuItem.toDomain(result)!;
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
