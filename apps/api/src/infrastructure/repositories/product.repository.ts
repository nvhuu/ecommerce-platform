import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(product: Partial<Product>): Promise<Product> {
    const created = await this.prisma.product.create({
      data: {
        name: product.name!,
        description: product.description!,
        price: product.price as Prisma.Decimal,
        stock: product.stock!,
        images: product.images!,
        categoryId: product.categoryId!,
      },
      include: { category: true },
    });
    return this.mapToEntity(created);
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      include: { category: true },
    });
    return products.map((p: any) => this.mapToEntity(p));
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) return null;
    return this.mapToEntity(product);
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { categoryId },
      include: { category: true },
    });
    return products.map((p: any) => this.mapToEntity(p));
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        name: product.name,
        description: product.description,
        price: product.price as Prisma.Decimal,
        stock: product.stock,
        images: product.images,
        categoryId: product.categoryId,
      },
      include: { category: true },
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  private mapToEntity(prismaProduct: any): Product {
    const p = new Product();
    p.id = prismaProduct.id;
    p.name = prismaProduct.name;
    p.description = prismaProduct.description;
    p.price = prismaProduct.price.toNumber();
    p.stock = prismaProduct.stock;
    p.images = prismaProduct.images;
    p.categoryId = prismaProduct.categoryId;
    p.createdAt = prismaProduct.createdAt;
    p.updatedAt = prismaProduct.updatedAt;
    if (prismaProduct.category) {
      // Map category if needed, avoiding circular dependency issues if possible
      // reusing mapToEntity from CategoryRepo is hard without injection.
      // For now just partial mapping or ignoring full category object in Product entity
      // entity has category?: Category.
      // Let's map basic fields.
      p.category = prismaProduct.category;
    }
    return p;
  }
}
