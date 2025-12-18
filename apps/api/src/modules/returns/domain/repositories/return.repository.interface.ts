import { Return } from '../entities/return.entity';

export interface IReturnRepository {
  create(data: Partial<Return> & { items: any[] }): Promise<Return>;
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
  updateStatus(id: string, status: any, approvedBy?: string): Promise<Return>;
}
