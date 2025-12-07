import { Expose } from 'class-transformer';

export class CursorPaginationMetaDto {
  @Expose()
  nextCursor?: string;

  @Expose()
  hasNextPage: boolean;

  @Expose()
  limit: number;
}

export class CursorPaginatedDto<T> {
  @Expose()
  data: T[];

  @Expose()
  meta: CursorPaginationMetaDto;

  constructor(data: T[], hasMore: boolean, limit: number, lastId?: string) {
    this.data = data;
    this.meta = {
      nextCursor:
        hasMore && lastId ? Buffer.from(lastId).toString('base64') : undefined,
      hasNextPage: hasMore,
      limit,
    };
  }
}
