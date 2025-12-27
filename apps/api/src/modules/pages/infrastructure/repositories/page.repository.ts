import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import {
  PaginatedResult,
  PaginationOptions,
} from '@/shared/interfaces/repository.interface';
import { Injectable } from '@nestjs/common';
import { Page, PageStatus, Prisma } from '@prisma/client';

@Injectable()
export class PageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PageCreateInput): Promise<Page> {
    return this.prisma.page.create({ data });
  }

  async findAll(options: PaginationOptions): Promise<PaginatedResult<Page>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.PageWhereInput = {
      deletedAt: null,
      ...(options.search
        ? {
            OR: [
              { title: { contains: options.search, mode: 'insensitive' } },
              { slug: { contains: options.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.page.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: SortOrder.DESC },
      }),
      this.prisma.page.count({ where }),
    ]);

    return {
      data,
      page,
      limit,
      total,
    };
  }

  async findPublished(
    options: PaginationOptions,
  ): Promise<PaginatedResult<Page>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.PageWhereInput = {
      status: PageStatus.PUBLISHED,
      publishedAt: { lte: new Date() },
      deletedAt: null,
      ...(options.search
        ? {
            OR: [
              { title: { contains: options.search, mode: 'insensitive' } },
              { slug: { contains: options.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.page.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: SortOrder.DESC },
      }),
      this.prisma.page.count({ where }),
    ]);

    return {
      data,
      page,
      limit,
      total,
    };
  }

  async findById(id: string): Promise<Page | null> {
    return this.prisma.page.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Page | null> {
    return this.prisma.page.findUnique({ where: { slug } });
  }

  async update(id: string, data: Prisma.PageUpdateInput): Promise<Page> {
    return this.prisma.page.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Page> {
    return this.prisma.page.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async publish(id: string): Promise<Page> {
    return this.prisma.page.update({
      where: { id },
      data: {
        status: PageStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });
  }

  async unpublish(id: string): Promise<Page> {
    return this.prisma.page.update({
      where: { id },
      data: {
        status: PageStatus.DRAFT,
      },
    });
  }
}
