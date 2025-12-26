import { Form, Prisma } from '@prisma/client';

export abstract class IFormRepository {
  abstract create(data: Prisma.FormCreateInput): Promise<Form>;
  abstract findAll(filters?: { status?: string }): Promise<Form[]>;
  abstract findById(id: string): Promise<Form | null>;
  abstract findBySlug(slug: string): Promise<Form | null>;
  abstract update(id: string, data: Prisma.FormUpdateInput): Promise<Form>;
  abstract delete(id: string): Promise<Form>;
}
