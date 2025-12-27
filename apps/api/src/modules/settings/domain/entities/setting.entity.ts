import { Expose } from 'class-transformer';

export class Setting {
  @Expose()
  key!: string;

  @Expose()
  value!: string;

  @Expose()
  category!: string;

  @Expose()
  description?: string;

  @Expose()
  isPublic!: boolean;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  static toDomain(input: unknown): Setting | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const entity = new Setting();
    entity.key = data.key as string;
    entity.value = data.value as string;
    entity.category = data.category as string;
    entity.description = data.description as string | undefined;
    entity.isPublic = data.isPublic as boolean;
    entity.createdAt = data.createdAt as Date;
    entity.updatedAt = data.updatedAt as Date;

    return entity;
  }
}
