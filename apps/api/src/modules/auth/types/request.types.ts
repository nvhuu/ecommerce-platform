import { Request } from 'express';

/**
 * Extended Express Request interface with authenticated user information.
 * The user object is populated by JwtStrategy.validate() and attached by JwtAuthGuard.
 */
export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}
