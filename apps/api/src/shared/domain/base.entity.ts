import { Expose } from 'class-transformer';

export abstract class BaseEntity {
  @Expose()
  id!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  @Expose()
  createdBy?: string;

  @Expose()
  updatedBy?: string;

  @Expose()
  deletedAt?: Date;

  @Expose()
  deletedBy?: string;
}
