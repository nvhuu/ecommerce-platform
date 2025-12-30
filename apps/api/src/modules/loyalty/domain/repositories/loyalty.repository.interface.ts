import { LoyaltyTransaction } from '../entities/loyalty-transaction.entity';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export abstract class ILoyaltyRepository {
  abstract createTransaction(
    data: Partial<LoyaltyTransaction>,
  ): Promise<LoyaltyTransaction>;

  abstract findByUserId(
    userId: string,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<LoyaltyTransaction>>;

  abstract getUserBalance(userId: string): Promise<number>;

  abstract findById(id: string): Promise<LoyaltyTransaction | null>;

  abstract findByOrderId(orderId: string): Promise<LoyaltyTransaction[]>;
}
