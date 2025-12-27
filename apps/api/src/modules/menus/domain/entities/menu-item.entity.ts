import { BaseEntity } from '@/shared/domain/base.entity';
import { Expose } from 'class-transformer';

export class MenuItem extends BaseEntity {
  @Expose()
  menuId!: string;

  @Expose()
  label!: string;

  @Expose()
  url?: string;

  @Expose()
  icon?: string;

  @Expose()
  order!: number;

  @Expose()
  parentId?: string;

  @Expose()
  isActive!: boolean;

  @Expose()
  children?: MenuItem[];

  static toDomain(input: unknown): MenuItem | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const entity = new MenuItem();
    entity.id = data.id as string;
    entity.menuId = data.menuId as string;
    entity.label = data.label as string;
    entity.url = data.url as string | undefined;
    entity.icon = data.icon as string | undefined;
    entity.order = data.order as number;
    entity.parentId = data.parentId as string | undefined;
    entity.isActive = data.isActive as boolean;
    entity.createdAt = data.createdAt as Date;
    entity.updatedAt = data.updatedAt as Date;

    // Map children if present
    if (Array.isArray(data.children)) {
      entity.children = data.children
        .map((child) => MenuItem.toDomain(child))
        .filter((child): child is MenuItem => child !== null);
    }

    return entity;
  }
}
