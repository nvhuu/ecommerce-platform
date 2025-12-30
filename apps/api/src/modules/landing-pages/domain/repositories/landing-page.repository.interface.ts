import { SortOrder } from '@/shared/constants/sort.constant';
import { LandingPage } from '../entities/landing-page.entity';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortOrder?: SortOrder;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export abstract class ILandingPageRepository {
  abstract create(data: Partial<LandingPage>): Promise<LandingPage>;
  abstract findById(id: string): Promise<LandingPage | null>;
  abstract findBySlug(slug: string): Promise<LandingPage | null>;
  abstract findAll(
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<LandingPage>>;
  abstract update(id: string, data: Partial<LandingPage>): Promise<LandingPage>;
  abstract delete(id: string): Promise<void>;
  abstract publish(id: string): Promise<LandingPage>;
  abstract archive(id: string): Promise<LandingPage>;
  abstract incrementViews(id: string): Promise<void>;
  abstract incrementConversions(id: string): Promise<void>;
}
