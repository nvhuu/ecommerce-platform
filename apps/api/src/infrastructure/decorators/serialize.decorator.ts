import { SetMetadata } from '@nestjs/common';

export const SERIALIZE_KEY = 'serialize';
export const PAGINATED_KEY = 'paginated';
export const CURSOR_PAGINATED_KEY = 'cursor_paginated';
export const HYBRID_PAGINATED_KEY = 'hybrid_paginated';

export const PaginatedDto = (dto: any) => {
  return { dto, isPaginated: true, isCursor: false };
};

export const CursorPaginatedDto = (dto: any) => {
  return { dto, isPaginated: true, isCursor: true };
};

export const HybridPaginatedDto = (dto: any) => {
  return { dto, isPaginated: true, isHybrid: true };
};

// Serialize decorator - accepts either DTO class or PaginatedDto result
export const Serialize = (dtoOrPaginated: any) => {
  if (dtoOrPaginated?.isPaginated) {
    return (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor,
    ) => {
      SetMetadata(SERIALIZE_KEY, dtoOrPaginated.dto)(
        target,
        propertyKey,
        descriptor,
      );

      if (dtoOrPaginated.isHybrid) {
        SetMetadata(HYBRID_PAGINATED_KEY, true)(
          target,
          propertyKey,
          descriptor,
        );
      } else if (dtoOrPaginated.isCursor) {
        SetMetadata(CURSOR_PAGINATED_KEY, true)(
          target,
          propertyKey,
          descriptor,
        );
      } else {
        SetMetadata(PAGINATED_KEY, true)(target, propertyKey, descriptor);
      }
    };
  }
  return SetMetadata(SERIALIZE_KEY, dtoOrPaginated);
};
