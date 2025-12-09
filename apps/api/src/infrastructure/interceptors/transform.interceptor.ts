import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { instanceToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: any) => {
        let responseData = data;
        let responseMessage =
          this.reflector.get<string>(
            RESPONSE_MESSAGE_KEY,
            context.getHandler(),
          ) || 'Success';

        // Check if data contains message override from service
        if (
          data &&
          typeof data === 'object' &&
          'message' in data &&
          'data' in data
        ) {
          responseMessage = data.message;
          responseData = data.data;
        }

        // Transform class instances to plain objects, respecting @Expose/@Exclude
        const transformedData = instanceToPlain(responseData, {
          excludeExtraneousValues: false,
          exposeUnsetFields: false,
        });

        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: responseMessage,
          data: transformedData as T,
        };
      }),
    );
  }
}
