import { Expose } from 'class-transformer';

export class HybridPaginationMetaDto {
  // Offset metadata (only when offset pagination used)
  @Expose()
  total?: number;

  @Expose()
  page?: number;

  @Expose()
  totalPages?: number;

  @Expose()
  hasPreviousPage?: boolean;

  // Cursor metadata (only when cursor pagination used)
  @Expose()
  nextCursor?: string;

  // Shared metadata
  @Expose()
  hasNextPage: boolean;

  @Expose()
  limit: number;

  @Expose()
  paginationType: 'offset' | 'cursor';
}

export class HybridPaginatedDto<T> {
  @Expose()
  data: T[];

  @Expose()
  meta: HybridPaginationMetaDto;

  constructor(
    data: T[],
    paginationType: 'offset' | 'cursor',
    options: {
      limit: number;
      // Offset options
      total?: number;
      page?: number;
      // Cursor options
      hasNextPage?: boolean;
      nextCursor?: string;
    },
  ) {
    this.data = data;

    if (paginationType === 'offset') {
      const totalPages = options.total
        ? Math.ceil(options.total / options.limit)
        : 0;
      const currentPage = options.page || 1;

      this.meta = {
        total: options.total,
        page: currentPage,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        limit: options.limit,
        paginationType: 'offset',
      };
    } else {
      this.meta = {
        nextCursor: options.nextCursor,
        hasNextPage: options.hasNextPage || false,
        limit: options.limit,
        paginationType: 'cursor',
      };
    }
  }
}
