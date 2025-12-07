import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(product: Partial<Product>): Promise<Product> {
    const createdProduct = await this.prisma.product.create({
      data: {
        name: product.name!,
        description: product.description!,
        price: product.price!,
        stock: product.stock!,
        images: product.images || [],
        categoryId: product.categoryId!,
      },
      include: { category: true },
    });
    return Product.toDomain(createdProduct)!;
  }

  async findAll(options: {
    cursor?: string;
    page?: number;
    limit: number;
  }): Promise<{
    data: Product[];
    total?: number;
    hasMore?: boolean;
    lastId?: string;
    usedCursor: boolean;
  }> {
    if (options.cursor) {
      // Cursor pagination
      const decodedCursor = Buffer.from(options.cursor, 'base64').toString();

      const data = await this.prisma.product.findMany({
        take: options.limit + 1,
        cursor: { id: decodedCursor },
        skip: 1,
        where: { deletedAt: null },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      });

      const hasMore = data.length > options.limit;
      const results = hasMore ? data.slice(0, options.limit) : data;
      const lastId =
        results.length > 0 ? results[results.length - 1].id : undefined;

      return {
        data: results
          .map((p: any) => Product.toDomain(p))
          .filter((p: Product | null): p is Product => p !== null),
        hasMore,
        lastId,
        usedCursor: true,
      };
    } else {
      // Offset pagination
      const skip = ((options.page || 1) - 1) * options.limit;

      const [data, total] = await Promise.all([
        this.prisma.product.findMany({
          where: { deletedAt: null },
          skip,
          take: options.limit,
          include: { category: true },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.product.count({
          where: { deletedAt: null },
        }),
      ]);

      return {
        data: data
          .map((p: any) => Product.toDomain(p))
          .filter((p: Product | null): p is Product => p !== null),
        total,
        usedCursor: false,
      };
    }
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product || product.deletedAt) return null;
    return Product.toDomain(product);
  }

  async findByCategory(
    categoryId: string,
    options: {
      cursor?: string;
      page?: number;
      limit: number;
    },
  ): Promise<{
    data: Product[];
    total?: number;
    hasMore?: boolean;
    lastId?: string;
    usedCursor: boolean;
  }> {
    if (options.cursor) {
      // Cursor pagination
      const decodedCursor = Buffer.from(options.cursor, 'base64').toString();

      const data = await this.prisma.product.findMany({
        take: options.limit + 1,
        cursor: { id: decodedCursor },
        skip: 1,
        where: {
          categoryId,
          deletedAt: null,
        },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      });

      const hasMore = data.length > options.limit;
      const results = hasMore ? data.slice(0, options.limit) : data;
      const lastId =
        results.length > 0 ? results[results.length - 1].id : undefined;

      return {
        data: results
          .map((p: any) => Product.toDomain(p))
          .filter((p: Product | null): p is Product => p !== null),
        hasMore,
        lastId,
        usedCursor: true,
      };
    } else {
      // Offset pagination
      const skip = ((options.page || 1) - 1) * options.limit;

      const [data, total] = await Promise.all([
        this.prisma.product.findMany({
          where: {
            categoryId,
            deletedAt: null,
          },
          skip,
          take: options.limit,
          include: { category: true },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.product.count({
          where: {
            categoryId,
            deletedAt: null,
          },
        }),
      ]);

      return {
        data: data
          .map((p: any) => Product.toDomain(p))
          .filter((p: Product | null): p is Product => p !== null),
        total,
        usedCursor: false,
      };
    }
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images,
        categoryId: product.categoryId,
      },
      include: { category: true },
    });
    return Product.toDomain(updated)!;
  }

  async delete(id: string, deletedBy?: string): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        ...(deletedBy && { deletedBy }),
      },
    });
  }
}
