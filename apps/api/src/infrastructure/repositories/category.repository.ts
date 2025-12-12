import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import { ICategoryRepository } from '../../domain/repositories/category.repository.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(category: Partial<Category>): Promise<Category> {
    const createdCategory = await this.prisma.category.create({
      data: {
        name: category.name!,
        slug: category.slug!,
        parentId: category.parentId,
      },
      include: { children: true },
    });
    return Category.toDomain(createdCategory)!;
  }

  async findAll(options: {
    cursor?: string;
    page?: number;
    limit: number;
    search?: string;
  }): Promise<{
    data: Category[];
    total?: number;
    hasMore?: boolean;
    lastId?: string;
    usedCursor: boolean;
  }> {
    if (options.cursor) {
      // Cursor pagination
      const decodedCursor = Buffer.from(options.cursor, 'base64').toString();

      const data = await this.prisma.category.findMany({
        take: options.limit + 1,
        cursor: { id: decodedCursor },
        skip: 1,
        where: {
          deletedAt: null,
          ...(options.search
            ? {
                OR: [
                  { name: { contains: options.search, mode: 'insensitive' } },
                  { slug: { contains: options.search, mode: 'insensitive' } },
                ],
              }
            : {}),
        },
        include: { children: true },
        orderBy: { createdAt: 'desc' },
      });

      const hasMore = data.length > options.limit;
      const results = hasMore ? data.slice(0, options.limit) : data;
      const lastId =
        results.length > 0 ? results[results.length - 1].id : undefined;

      return {
        data: results
          .map((c) => Category.toDomain(c))
          .filter((c): c is Category => c !== null),
        hasMore,
        lastId,
        usedCursor: true,
      };
    } else {
      // Offset pagination
      const skip = ((options.page || 1) - 1) * options.limit;

      const [data, total] = await Promise.all([
        this.prisma.category.findMany({
          where: {
            deletedAt: null,
            ...(options.search
              ? {
                  OR: [
                    { name: { contains: options.search, mode: 'insensitive' } },
                    { slug: { contains: options.search, mode: 'insensitive' } },
                  ],
                }
              : {}),
          },
          skip,
          take: options.limit,
          include: { children: true },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.category.count({
          where: {
            deletedAt: null,
            ...(options.search
              ? {
                  OR: [
                    { name: { contains: options.search, mode: 'insensitive' } },
                    { slug: { contains: options.search, mode: 'insensitive' } },
                  ],
                }
              : {}),
          },
        }),
      ]);

      return {
        data: data
          .map((c) => Category.toDomain(c))
          .filter((c): c is Category => c !== null),
        total,
        usedCursor: false,
      };
    }
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { children: true, parent: true },
    });
    if (!category || category.deletedAt) return null;
    return Category.toDomain(category);
  }

  async update(id: string, category: Partial<Category>): Promise<Category> {
    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
      },
      include: { children: true },
    });
    return Category.toDomain(updated)!;
  }

  async delete(id: string, deletedBy?: string): Promise<void> {
    await this.prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        ...(deletedBy && { deletedBy }),
      },
    });
  }
}
