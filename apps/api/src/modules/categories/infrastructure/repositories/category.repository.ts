import { PrismaService } from '@/core/prisma/prisma.service';
import {
  PaginatedResult,
  PaginationOptions,
} from '@/shared/interfaces/repository.interface';
import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import { ICategoryRepository } from '../../domain/repositories/category.repository.interface';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(
    options: PaginationOptions,
  ): Promise<PaginatedResult<Category>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(options.search ? { name: { contains: options.search } } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.category.count({ where }),
    ]);

    const categories = data
      .map((c) => Category.toDomain(c))
      .filter((c): c is Category => c !== null);

    return {
      data: categories,
      page,
      limit,
      total,
    };
  }

  async findById(id: string): Promise<Category | null> {
    const data = await this.prisma.category.findUnique({
      where: { id },
    });
    return data ? Category.toDomain(data) : null;
  }

  async findByParentId(parentId: string | null): Promise<Category[]> {
    const data = await this.prisma.category.findMany({
      where: { parentId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
    return data
      .map((c) => Category.toDomain(c))
      .filter((c): c is Category => c !== null);
  }

  async create(category: Category): Promise<Category> {
    const created = await this.prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        ...(category.parentId && { parentId: category.parentId }),
        createdBy: category.createdBy || null,
      },
    });
    const result = Category.toDomain(created);
    if (!result) throw new Error('Failed to create category');
    return result;
  }

  async update(id: string, category: Partial<Category>): Promise<Category> {
    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        ...(category.name && { name: category.name }),
        ...(category.slug && { slug: category.slug }),
        ...(category.parentId !== undefined && { parentId: category.parentId }),
      },
    });
    const result = Category.toDomain(updated);
    if (!result) throw new Error('Failed to update category');
    return result;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
