import { BaseEntity } from '@/shared/domain/base.entity';
import { Expose } from 'class-transformer';

export class SearchLog extends BaseEntity {
  @Expose()
  query!: string;

  @Expose()
  userId?: string;

  @Expose()
  sessionId!: string;

  @Expose()
  resultsCount!: number;

  @Expose()
  clickedResults!: string[];

  @Expose()
  filters?: Record<string, unknown>;

  @Expose()
  sortBy?: string;

  @Expose()
  searchedAt!: Date;

  static toDomain(input: unknown): SearchLog | null {
    if (!input || typeof input !== 'object') return null;

    const data = input as Record<string, unknown>;

    const entity = new SearchLog();
    entity.id = typeof data.id === 'string' ? data.id : '';
    entity.query = typeof data.query === 'string' ? data.query : '';
    entity.userId = typeof data.userId === 'string' ? data.userId : undefined;
    entity.sessionId = typeof data.sessionId === 'string' ? data.sessionId : '';
    entity.resultsCount =
      typeof data.resultsCount === 'number' ? data.resultsCount : 0;
    entity.clickedResults = Array.isArray(data.clickedResults)
      ? (data.clickedResults as string[])
      : [];
    entity.filters =
      data.filters && typeof data.filters === 'object'
        ? (data.filters as Record<string, unknown>)
        : undefined;
    entity.sortBy = typeof data.sortBy === 'string' ? data.sortBy : undefined;
    entity.searchedAt =
      data.searchedAt instanceof Date
        ? data.searchedAt
        : typeof data.searchedAt === 'string'
          ? new Date(data.searchedAt)
          : new Date();
    entity.createdAt =
      data.createdAt instanceof Date
        ? data.createdAt
        : typeof data.createdAt === 'string'
          ? new Date(data.createdAt)
          : new Date();
    entity.updatedAt =
      data.updatedAt instanceof Date
        ? data.updatedAt
        : typeof data.updatedAt === 'string'
          ? new Date(data.updatedAt)
          : new Date();

    return entity;
  }
}
