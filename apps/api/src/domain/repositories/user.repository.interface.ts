import { User } from '../entities/user.entity';

export interface IUserRepository {
  create(user: Partial<User>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(options: { cursor?: string; page?: number; limit: number }): Promise<{
    data: User[];
    total?: number;
    hasMore?: boolean;
    lastId?: string;
    usedCursor: boolean;
  }>;
  update(id: string, data: Partial<User>): Promise<User | null>;
  delete(id: string, deletedBy?: string): Promise<void>;
}
