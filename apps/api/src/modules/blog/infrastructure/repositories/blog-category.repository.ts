import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import {
  PaginatedResult,
  PaginationOptions,
} from '@/shared/interfaces/repository.interface';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BlogCategory } from '../../domain/entities/blog-category.entity';
import { IBlogCategoryRepository } from '../../domain/repositories/blog-category.repository.interface';

@Injectable()
export class BlogCategoryRepository implements IBlogCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(category: Partial<BlogCategory>): Promise<BlogCategory> {
    const created = await this.prisma.blogCategory.create({
      data: {
        name: category.name!,
        slug: category.slug!,
        description: category.description,
        isActive: category.isActive ?? true,
        seoTitle: category.seoTitle,
        seoDescription: category.seoDescription,
        seoKeywords: category.seoKeywords || [],
      },
    });
    const result = BlogCategory.toDomain(created);
    if (!result) throw new Error('Failed to create blog category');
    return result;
  }

  async findAll(
    options: PaginationOptions,
  ): Promise<PaginatedResult<BlogCategory>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.BlogCategoryWhereInput = {
      ...(options.search
        ? {
            OR: [
              { name: { contains: options.search, mode: 'insensitive' } },
              {
                description: { contains: options.search, mode: 'insensitive' },
              },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.blogCategory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: SortOrder.DESC },
      }),
      this.prisma.blogCategory.count({ where }),
    ]);

    return {
      data: data
        .map((item) => BlogCategory.toDomain(item))
        .filter((item): item is BlogCategory => item !== null),
      page,
      limit,
      total,
    };
  }

  async findById(id: string): Promise<BlogCategory | null> {
    const category = await this.prisma.blogCategory.findUnique({
      where: { id },
    });
    return category ? BlogCategory.toDomain(category) : null;
  }

  async findBySlug(slug: string): Promise<BlogCategory | null> {
    const category = await this.prisma.blogCategory.findUnique({
      where: { slug },
    });
    return category ? BlogCategory.toDomain(category) : null;
  }

  async update(
    id: string,
    category: Partial<BlogCategory>,
  ): Promise<BlogCategory> {
    const updated = await this.prisma.blogCategory.update({
      where: { id },
      data: {
        ...(category.name && { name: category.name }),
        ...(category.slug && { slug: category.slug }),
        ...(category.description !== undefined && {
          description: category.description,
        }),
        ...(category.isActive !== undefined && { isActive: category.isActive }),
        ...(category.seoTitle !== undefined && { seoTitle: category.seoTitle }),
        ...(category.seoDescription !== undefined && {
          seoDescription: category.seoDescription,
        }),
        ...(category.seoKeywords !== undefined && {
          seoKeywords: category.seoKeywords,
        }),
      },
    });
    const result = BlogCategory.toDomain(updated);
    if (!result) throw new Error('Failed to update blog category');
    return result;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.blogCategory.delete({
      where: { id },
    });
  }
}
