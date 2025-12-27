import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductVariant } from '../../domain/entities/product-variant.entity';
import { IProductVariantRepository } from '../../domain/repositories/product-variant.repository.interface';

@Injectable()
export class ProductVariantRepository implements IProductVariantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(productId: string): Promise<ProductVariant[]> {
    const variants = await this.prisma.productVariant.findMany({
      where: { productId },
      orderBy: { createdAt: SortOrder.DESC },
    });

    return variants
      .map((v) => ProductVariant.toDomain(v))
      .filter((v): v is ProductVariant => v !== null);
  }

  async findById(id: string): Promise<ProductVariant | null> {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
    });

    return variant ? ProductVariant.toDomain(variant) : null;
  }

  async findBySku(sku: string): Promise<ProductVariant | null> {
    const variant = await this.prisma.productVariant.findUnique({
      where: { sku },
    });

    return variant ? ProductVariant.toDomain(variant) : null;
  }

  async create(variant: Partial<ProductVariant>): Promise<ProductVariant> {
    const created = await this.prisma.productVariant.create({
      data: {
        productId: variant.productId!,
        sku: variant.sku!,
        name: variant.name!,
        attributes: variant.attributes as never,
        price: variant.price!,
        stock: variant.stock ?? 0,
        reserved: variant.reserved ?? 0,
        isActive: variant.isActive ?? true,
      },
    });

    const result = ProductVariant.toDomain(created);
    if (!result) throw new Error('Failed to create variant');
    return result;
  }

  async update(
    id: string,
    variant: Partial<ProductVariant>,
  ): Promise<ProductVariant> {
    const updated = await this.prisma.productVariant.update({
      where: { id },
      data: {
        ...(variant.name && { name: variant.name }),
        ...(variant.attributes && { attributes: variant.attributes as never }),
        ...(variant.price !== undefined && { price: variant.price }),
        ...(variant.stock !== undefined && { stock: variant.stock }),
        ...(variant.isActive !== undefined && { isActive: variant.isActive }),
      },
    });

    const result = ProductVariant.toDomain(updated);
    if (!result) throw new Error('Failed to update variant');
    return result;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.productVariant.delete({
      where: { id },
    });
  }

  async reserveStock(variantId: string, quantity: number): Promise<void> {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${variantId} not found`);
    }

    const available = variant.stock - variant.reserved;
    if (available < quantity) {
      throw new ConflictException(
        `Insufficient stock. Available: ${available}, Requested: ${quantity}`,
      );
    }

    await this.prisma.productVariant.update({
      where: { id: variantId },
      data: {
        reserved: variant.reserved + quantity,
      },
    });
  }

  async releaseStock(variantId: string, quantity: number): Promise<void> {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${variantId} not found`);
    }

    await this.prisma.productVariant.update({
      where: { id: variantId },
      data: {
        reserved: Math.max(0, variant.reserved - quantity),
      },
    });
  }

  async deductStock(variantId: string, quantity: number): Promise<void> {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${variantId} not found`);
    }

    await this.prisma.productVariant.update({
      where: { id: variantId },
      data: {
        stock: Math.max(0, variant.stock - quantity),
        reserved: Math.max(0, variant.reserved - quantity),
      },
    });
  }

  async findLowStock(threshold: number): Promise<ProductVariant[]> {
    const variants = await this.prisma.productVariant.findMany({
      where: {
        stock: {
          lte: threshold,
        },
      },
      orderBy: { stock: SortOrder.ASC },
    });

    return variants
      .map((v) => ProductVariant.toDomain(v))
      .filter((v): v is ProductVariant => v !== null);
  }
}
