import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { Form, Prisma } from '@prisma/client';
import { IFormRepository } from '../../domain/repositories/form.repository.interface';

@Injectable()
export class FormRepository implements IFormRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.FormCreateInput): Promise<Form> {
    return this.prisma.form.create({ data });
  }

  async findAll(filters?: { status?: string }): Promise<Form[]> {
    return this.prisma.form.findMany({
      where: filters?.status ? { status: filters.status as any } : undefined,
      orderBy: { createdAt: SortOrder.DESC },
    });
  }

  async findById(id: string): Promise<Form | null> {
    return this.prisma.form.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Form | null> {
    return this.prisma.form.findUnique({ where: { slug } });
  }

  async update(id: string, data: Prisma.FormUpdateInput): Promise<Form> {
    return this.prisma.form.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Form> {
    return this.prisma.form.delete({ where: { id } });
  }
}
