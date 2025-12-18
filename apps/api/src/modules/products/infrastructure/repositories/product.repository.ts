import { PrismaService } from '@/core/prisma/prisma.service';
import {
  PaginatedResult,
  PaginationOptions,
} from '@/shared/interfaces/repository.interface';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Product } from '../../domain/entities/product.entity';
import {
  IProductRepository,
  ProductFilterOptions,
} from '../../domain/repositories/product.repository.interface';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(
    options: ProductFilterOptions,
  ): Promise<PaginatedResult<Product>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      ...(options.search ? { name: { contains: options.search } } : {}),
      ...(options.categoryId ? { categoryId: options.categoryId } : {}),
      ...(options.minPrice !== undefined || options.maxPrice !== undefined
        ? {
            price: {
              gte: options.minPrice,
              lte: options.maxPrice,
            },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    const products = data
      .map((p) => Product.toDomain(p))
      .filter((p): p is Product => p !== null);

    return {
      data: products,
      page,
      limit,
      total,
    };
  }

  async findByCategory(
    categoryId: string,
    options: PaginationOptions,
  ): Promise<PaginatedResult<Product>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where = {
      categoryId,
      deletedAt: null,
      ...(options.search ? { name: { contains: options.search } } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    const products = data
      .map((p) => Product.toDomain(p))
      .filter((p): p is Product => p !== null);

    return {
      data: products,
      page,
      limit,
      total,
    };
  }

  async findById(id: string): Promise<Product | null> {
    const data = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    return data ? Product.toDomain(data) : null;
  }

  async create(product: Partial<Product>): Promise<Product> {
    const created = await this.prisma.product.create({
      data: {
        name: product.name!,
        slug: product
          .name!.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, ''),
        description: product.description!,
        price: product.price!,
        stock: product.stock!,
        images: product.images || [],
        categoryId: product.categoryId!,
      },
      include: { category: true },
    });
    const result = Product.toDomain(created);
    if (!result) throw new Error('Failed to create product');
    return result;
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        ...(product.name && { name: product.name }),
        ...(product.description !== undefined && {
          description: product.description,
        }),
        ...(product.price !== undefined && { price: product.price }),
        ...(product.stock !== undefined && { stock: product.stock }),
        ...(product.images !== undefined && { images: product.images }),
        ...(product.categoryId && { categoryId: product.categoryId }),
      },
      include: { category: true },
    });
    const result = Product.toDomain(updated);
    if (!result) throw new Error('Failed to update product');
    return result;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
