import { BaseEntity } from '@/shared/domain/base.entity';
import { Expose } from 'class-transformer';
import { MenuItem } from './menu-item.entity';

export class Menu extends BaseEntity {
  @Expose()
  name!: string;

  @Expose()
  location!: string;

  @Expose()
  isActive!: boolean;

  @Expose()
  items?: MenuItem[];

  static toDomain(input: unknown): Menu | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;

    const entity = new Menu();
    entity.id = data.id as string;
    entity.name = data.name as string;
    entity.location = data.location as string;
    entity.isActive = data.isActive as boolean;
    entity.createdAt = data.createdAt as Date;
    entity.updatedAt = data.updatedAt as Date;

    if (Array.isArray(data.items)) {
      entity.items = data.items
        .map((item) => MenuItem.toDomain(item))
        .filter((item): item is MenuItem => item !== null);
    }

    return entity;
  }
}
