import { Expose, Type } from 'class-transformer';
import { BaseEntity } from '@/shared/domain/base.entity';
import { Media } from './media.entity';

export class MediaFolder extends BaseEntity {
  @Expose()
  name!: string;

  @Expose()
  parentId?: string | null;

  @Expose()
  @Type(() => MediaFolder)
  children?: MediaFolder[];

  @Expose()
  @Type(() => Media)
  media?: Media[];

  static toDomain(data: unknown): MediaFolder | null {
    if (!data || typeof data !== 'object') return null;

    const record = data as Record<string, unknown>;
    const folder = new MediaFolder();

    folder.id = record.id as string;
    folder.name = record.name as string;
    folder.parentId = (record.parentId as string | null) || null;
    folder.createdBy = (record.createdBy as string | null) || undefined;
    folder.createdAt = record.createdAt as Date;

    if (record.children && Array.isArray(record.children)) {
      folder.children = record.children
        .map((c) => MediaFolder.toDomain(c))
        .filter((f): f is MediaFolder => f !== null);
    }

    if (record.media && Array.isArray(record.media)) {
      folder.media = record.media
        .map((m) => Media.toDomain(m))
        .filter((m): m is Media => m !== null);
    }

    return folder;
  }
}
