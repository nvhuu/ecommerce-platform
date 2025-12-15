import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { SERIALIZE_KEY } from '../decorators/serialize.decorator';

/**
 * Custom serializer interceptor that transforms responses to DTOs
 * Uses @Serialize() decorator to determine which DTO class to use
 */
@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const target = this.reflector.get<ClassConstructor<unknown>>(
      SERIALIZE_KEY,
      context.getHandler(),
    );

    if (!target) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data: unknown) => {
        // Handle single object or array
        if (Array.isArray(data)) {
          return data.map((item) =>
            plainToInstance(target, item, { excludeExtraneousValues: true }),
          );
        }

        return plainToInstance(target, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
