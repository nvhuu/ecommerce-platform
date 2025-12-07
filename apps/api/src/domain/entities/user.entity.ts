import { Exclude, Expose } from 'class-transformer';
import { BaseEntity } from './base.entity';

export class User extends BaseEntity {
  @Expose()
  email!: string;

  @Exclude()
  password!: string;

  @Expose()
  role!: Role;

  static toDomain(data: any): User | null {
    if (!data) return null;
    const user = new User();
    user.id = data.id;
    user.email = data.email;
    user.password = data.password;
    user.role = data.role;
    user.createdAt = data.createdAt;
    user.updatedAt = data.updatedAt;
    user.createdBy = data.createdBy;
    user.updatedBy = data.updatedBy;
    user.deletedAt = data.deletedAt;
    user.deletedBy = data.deletedBy;
    return user;
  }
}

export enum Role {
  USER = 'USER',
  SUPERADMIN = 'SUPERADMIN',
}
