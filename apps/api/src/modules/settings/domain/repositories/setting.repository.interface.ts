import { Prisma } from '@prisma/client';
import { Setting } from '../entities/setting.entity';

export abstract class ISettingRepository {
  abstract create(data: Prisma.SettingCreateInput): Promise<Setting>;
  abstract findAll(): Promise<Setting[]>;
  abstract findByCategory(category: string): Promise<Setting[]>;
  abstract findByKey(key: string): Promise<Setting | null>;
  abstract findPublic(): Promise<Setting[]>;
  abstract update(
    key: string,
    data: Prisma.SettingUpdateInput,
  ): Promise<Setting>;
  abstract delete(key: string): Promise<Setting>;
}
