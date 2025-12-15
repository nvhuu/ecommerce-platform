import { ApiResponse } from '@/shared/dtos/response/api-response.dto';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Global interceptor that wraps all responses in ApiResponse format
 * Automatically extracts message from service response if present
 * Detects pagination structure and adds paging metadata
 */
@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((serviceResponse) => {
        const statusCode = response.statusCode || 200;
        let message = 'Success';
        let data = serviceResponse;

        // Extract message and data if service returns { message, data, ...}
        if (
          serviceResponse &&
          typeof serviceResponse === 'object' &&
          'message' in serviceResponse
        ) {
          const typedResponse = serviceResponse as {
            message: string;
            data: unknown;
            page?: number;
            limit?: number;
            total?: number;
          };

          message = typedResponse.message;
          data = typedResponse.data;

          // Check if it also has pagination info
          if (
            'page' in typedResponse &&
            'limit' in typedResponse &&
            'total' in typedResponse
          ) {
            return ApiResponse.successWithPaging(
              data,
              {
                page: typedResponse.page,
                limit: typedResponse.limit,
                total: typedResponse.total,
              },
              message,
              statusCode,
            );
          }
        }
        // Legacy support: Check for pagination structure without message
        else if (
          data &&
          typeof data === 'object' &&
          'page' in data &&
          'limit' in data &&
          'total' in data &&
          'data' in data
        ) {
          const paginatedData = data as {
            data: unknown;
            page: number;
            limit: number;
            total: number;
          };

          return ApiResponse.successWithPaging(
            paginatedData.data,
            {
              page: paginatedData.page,
              limit: paginatedData.limit,
              total: paginatedData.total,
            },
            message,
            statusCode,
          );
        }

        // Regular response
        return ApiResponse.success(data, message, statusCode);
      }),
    );
  }
}
