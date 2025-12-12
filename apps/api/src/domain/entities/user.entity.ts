import { Exclude, Expose } from 'class-transformer';
import { BaseEntity } from './base.entity';

export class User extends BaseEntity {
  @Expose()
  email!: string;

  @Exclude()
  password!: string;

  @Expose()
  role!: Role;

  static toDomain(input: unknown): User | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;
    const user = new User();
    user.id = data.id as string;
    user.email = data.email as string;
    user.password = data.password as string;
    user.role = data.role as Role;
    user.createdAt = data.createdAt as Date;
    user.updatedAt = data.updatedAt as Date;
    user.createdBy = data.createdBy as string;
    user.updatedBy = data.updatedBy as string;
    user.deletedAt = data.deletedAt ? (data.deletedAt as Date) : undefined;
    user.deletedBy = data.deletedBy ? (data.deletedBy as string) : undefined;
    return user;
  }
}

export enum Role {
  USER = 'USER',
  SUPERADMIN = 'SUPERADMIN',
}
