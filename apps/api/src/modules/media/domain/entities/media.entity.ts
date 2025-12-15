import { Expose } from 'class-transformer';
import { BaseEntity } from '@/shared/domain/base.entity';

export class Media extends BaseEntity {
  @Expose()
  fileName!: string;

  @Expose()
  fileType!: string;

  @Expose()
  fileSize!: number;

  @Expose()
  fileUrl!: string;

  @Expose()
  folderId?: string | null;

  static toDomain(data: unknown): Media | null {
    if (!data || typeof data !== 'object') return null;

    const record = data as Record<string, unknown>;
    const media = new Media();

    media.id = record.id as string;
    media.fileName = record.fileName as string;
    media.fileType = record.fileType as string;
    media.fileSize = record.fileSize as number;
    media.fileUrl = record.fileUrl as string;
    media.folderId = (record.folderId as string | null) || null;
    media.createdBy = (record.createdBy as string | null) || undefined;
    media.createdAt = record.createdAt as Date;

    return media;
  }
}
