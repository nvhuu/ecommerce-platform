import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response as ExpressResponse } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: unknown) => {
        let responseData = data;
        let responseMessage =
          this.reflector.get<string>(
            RESPONSE_MESSAGE_KEY,
            context.getHandler(),
          ) || 'Operation successful';

        if (
          data &&
          typeof data === 'object' &&
          'message' in data &&
          'data' in data
        ) {
          const typedData = data as { message: string; data: unknown };
          responseMessage = typedData.message;
          responseData = typedData.data;
        }

        const transformedData = responseData;

        return {
          statusCode: context.switchToHttp().getResponse<ExpressResponse>()
            .statusCode,
          message: responseMessage,
          data: transformedData as T,
        };
      }),
    );
  }
}
