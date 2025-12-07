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
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Set by JwtAuthGuard

    if (user && request.body) {
      const method = request.method;

      // Auto-populate createdBy for POST requests
      if (method === 'POST') {
        request.body.createdBy = user.id;
        request.body.updatedBy = user.id;
      }

      // Auto-populate updatedBy for PATCH/PUT requests
      if (method === 'PATCH' || method === 'PUT') {
        request.body.updatedBy = user.id;
      }
    }

    return next.handle();
  }
}
