import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = unknown>(
    err: unknown,
    user: unknown,
    _info: unknown,
  ): TUser {
    // No error is thrown if no user is found
    // user will be false if not authenticated
    return user as TUser;
  }
}
