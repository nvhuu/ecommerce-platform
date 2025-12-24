import { ReturnStatus } from '@prisma/client';
import { Return } from '../entities/return.entity';

export interface IReturnRepository {
  create(
    data: Partial<Return> & {
      items: {
        productId: string;
        variantId: string;
        quantity: number;
        refundAmount: number;
        reason: string;
      }[];
    },
  ): Promise<Return>;
  findAll(
    page?: number,
    limit?: number,
  ): Promise<{ data: Return[]; total: number }>;
  findByUser(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<{ data: Return[]; total: number }>;
  findById(id: string): Promise<Return | null>;
  updateStatus(
    id: string,
    status: ReturnStatus,
    approvedBy?: string,
  ): Promise<Return>;
}
