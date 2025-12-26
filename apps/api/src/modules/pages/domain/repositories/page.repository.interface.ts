import {
  PaginatedResult,
  PaginationOptions,
} from '@/shared/interfaces/repository.interface';
import { Page, Prisma } from '@prisma/client';

export interface IPageRepository {
  create(data: Prisma.PageCreateInput): Promise<Page>;
  findAll(options: PaginationOptions): Promise<PaginatedResult<Page>>;
  findPublished(options: PaginationOptions): Promise<PaginatedResult<Page>>;
  findById(id: string): Promise<Page | null>;
  findBySlug(slug: string): Promise<Page | null>;
  update(id: string, data: Prisma.PageUpdateInput): Promise<Page>;
  delete(id: string): Promise<Page>;
  publish(id: string): Promise<Page>;
  unpublish(id: string): Promise<Page>;
}

export const IPageRepository = Symbol('IPageRepository');
