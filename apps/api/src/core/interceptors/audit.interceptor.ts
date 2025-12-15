import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Interceptor to automatically populate createdBy/updatedBy fields
 * from the authenticated user in the request context
 */
import { Request } from 'express';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as { id: string } | undefined;

    if (user && request.body) {
      const method = request.method;
      const body = request.body as Record<string, unknown>;

      // Auto-populate createdBy for POST requests
      if (method === 'POST') {
        body.createdBy = user.id;
        body.updatedBy = user.id;
      }

      // Auto-populate updatedBy for PATCH/PUT requests
      if (method === 'PATCH' || method === 'PUT') {
        body.updatedBy = user.id;
      }
    }

    return next.handle();
  }
}
