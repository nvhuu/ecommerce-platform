import { SettingType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { BaseEntity } from '@/shared/domain/base.entity';

export class Setting extends BaseEntity {

  @Expose()
  key!: string;

  @Expose()
  value!: string;

  @Expose()
  type!: SettingType;

  @Expose()
  category!: string;

  @Expose()
  label!: string;

  @Expose()
  description!: string | null;

  @Expose()
  validation!: string | null;

  @Expose()
  isPublic!: boolean;



  static toDomain(input: unknown): Setting | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const entity = new Setting();
    entity.id = data.id as string;
    entity.key = data.key as string;
    entity.value = data.value as string;
    entity.type = data.type as SettingType;
    entity.category = data.category as string;
    entity.label = data.label as string;
    entity.description = (data.description as string | null) ?? null;
    entity.validation = (data.validation as string | null) ?? null;
    entity.isPublic = data.isPublic as boolean;
    entity.createdAt = data.createdAt as Date;
    entity.updatedAt = data.updatedAt as Date;

    return entity;
  }
}
