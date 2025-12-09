import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { CursorPaginatedDto } from '../../application/dtos/response/cursor-paginated.response.dto';
import { HybridPaginatedDto } from '../../application/dtos/response/hybrid-paginated.response.dto';
import { PaginatedDto } from '../../application/dtos/response/paginated.response.dto';
import {
  CURSOR_PAGINATED_KEY,
  HYBRID_PAGINATED_KEY,
  PAGINATED_KEY,
  SERIALIZE_KEY,
} from '../decorators/serialize.decorator';

/**
 * Custom serializer interceptor that transforms responses to DTOs
 * Uses @Serialize() decorator to determine which DTO class to use
 * Supports both regular and paginated responses via decorator metadata
 */
@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const target = this.reflector.get(SERIALIZE_KEY, context.getHandler());
    const isPaginated = this.reflector.get(PAGINATED_KEY, context.getHandler());
    const isCursorPaginated = this.reflector.get(
      CURSOR_PAGINATED_KEY,
      context.getHandler(),
    );
    const isHybridPaginated = this.reflector.get(
      HYBRID_PAGINATED_KEY,
      context.getHandler(),
    );

    if (!target) {
      return next.handle();
    }

    return next.handle().pipe(
      map((res: any) => {
        let data = res;
        let message: string | undefined;

        // Check if response matches ServiceResponse interface
        if (
          res &&
          typeof res === 'object' &&
          'message' in res &&
          'data' in res
        ) {
          data = res.data;
          message = res.message;
        }

        let serializedData: any;

        // Handle hybrid pagination
        if (isHybridPaginated && data instanceof HybridPaginatedDto) {
          const transformedData = data.data.map((item: any) =>
            plainToInstance(target, item, { excludeExtraneousValues: true }),
          );

          serializedData = new HybridPaginatedDto(
            transformedData,
            data.meta.paginationType,
            {
              limit: data.meta.limit,
              ...(data.meta.paginationType === 'offset'
                ? {
                    total: data.meta.total,
                    page: data.meta.page,
                  }
                : {
                    hasNextPage: data.meta.hasNextPage,
                    nextCursor: data.meta.nextCursor,
                  }),
            },
          );
        }
        // Handle cursor pagination
        else if (isCursorPaginated && data instanceof CursorPaginatedDto) {
          const transformedData = data.data.map((item: any) =>
            plainToInstance(target, item, { excludeExtraneousValues: true }),
          );
          serializedData = new CursorPaginatedDto(
            transformedData,
            data.meta.hasNextPage,
            data.meta.limit,
            data.meta.nextCursor
              ? Buffer.from(data.meta.nextCursor, 'base64').toString()
              : undefined,
          );
        }
        // Handle offset pagination
        else if (isPaginated && data instanceof PaginatedDto) {
          const transformedData = data.data.map((item: any) =>
            plainToInstance(target, item, { excludeExtraneousValues: true }),
          );
          serializedData = new PaginatedDto(
            transformedData,
            data.meta.total,
            data.meta.page,
            data.meta.limit,
          );
        }
        // Handle single object or array
        else if (Array.isArray(data)) {
          serializedData = data.map((item) =>
            plainToInstance(target, item, { excludeExtraneousValues: true }),
          );
        } else {
          serializedData = plainToInstance(target, data, {
            excludeExtraneousValues: true,
          });
        }

        if (message) {
          return { message, data: serializedData };
        }
        return serializedData;
      }),
    );
  }
}
