import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import { ICategoryRepository } from '../../domain/repositories/category.repository.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(category: Partial<Category>): Promise<Category> {
    const created = await this.prisma.category.create({
      data: {
        name: category.name!,
        slug: category.slug!,
        parentId: category.parentId,
      },
    });
    return this.mapToEntity(created);
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      include: { children: true },
    });
    return categories.map((c: any) => this.mapToEntity(c));
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { children: true, parent: true },
    });
    if (!category) return null;
    return this.mapToEntity(category);
  }

  async update(id: string, category: Partial<Category>): Promise<Category> {
    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
      },
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }

  private mapToEntity(prismaCategory: any): Category {
    const cat = new Category();
    cat.id = prismaCategory.id;
    cat.name = prismaCategory.name;
    cat.slug = prismaCategory.slug;
    cat.parentId = prismaCategory.parentId;
    cat.createdAt = prismaCategory.createdAt;
    cat.updatedAt = prismaCategory.updatedAt;
    if (prismaCategory.children) {
      cat.children = prismaCategory.children.map((c: any) =>
        this.mapToEntity(c),
      );
    }
    if (prismaCategory.parent) {
      cat.parent = this.mapToEntity(prismaCategory.parent);
    }
    return cat;
  }
}
