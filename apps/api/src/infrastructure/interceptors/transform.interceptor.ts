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
      map((data) => {
        // Transform class instances to plain objects, respecting @Expose/@Exclude
        const transformedData = instanceToPlain(data, {
          excludeExtraneousValues: false,
          exposeUnsetFields: false,
        });

        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message:
            this.reflector.get<string>(
              RESPONSE_MESSAGE_KEY,
              context.getHandler(),
            ) || 'Success',
          data: transformedData as T,
        };
      }),
    );
  }
}
