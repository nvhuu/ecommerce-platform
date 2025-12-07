import { Exclude, Expose } from 'class-transformer';

export class User {
  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Exclude()
  password!: string;

  @Expose()
  role!: Role;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}

export enum Role {
  USER = 'USER',
  SUPERADMIN = 'SUPERADMIN',
}
