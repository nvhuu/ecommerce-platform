import { SetMetadata } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

export const SERIALIZE_KEY = 'serialize';
export const PAGINATED_KEY = 'paginated';
export const CURSOR_PAGINATED_KEY = 'cursor_paginated';
export const HYBRID_PAGINATED_KEY = 'hybrid_paginated';

export const PaginatedDto = (dto: ClassConstructor<unknown>) => {
  return { dto, isPaginated: true, isCursor: false };
};

export const CursorPaginatedDto = (dto: ClassConstructor<unknown>) => {
  return { dto, isPaginated: true, isCursor: true };
};

export const HybridPaginatedDto = (dto: ClassConstructor<unknown>) => {
  return { dto, isPaginated: true, isHybrid: true };
};

// ... other imports

export interface PaginatedOptions {
  dto: ClassConstructor<unknown>;
  isPaginated: boolean;
  isCursor?: boolean;
  isHybrid?: boolean;
}

// Serialize decorator - accepts either DTO class or PaginatedDto result
export const Serialize = (
  dtoOrPaginated: ClassConstructor<unknown> | PaginatedOptions,
) => {
  const options = dtoOrPaginated as PaginatedOptions;
  if ('isPaginated' in options && options.isPaginated) {
    return (
      target: object,
      propertyKey: string | symbol,
      descriptor: PropertyDescriptor,
    ) => {
      SetMetadata(SERIALIZE_KEY, options.dto)(target, propertyKey, descriptor);

      if (options.isHybrid) {
        SetMetadata(HYBRID_PAGINATED_KEY, true)(
          target,
          propertyKey,
          descriptor,
        );
      } else if (options.isCursor) {
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
