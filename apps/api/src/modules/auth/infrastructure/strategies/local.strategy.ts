import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { User } from '../../../users/domain/entities/user.entity';
import { AuthService } from '../../application/services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'>> {
    const reqAny = req as any;
    const ip = reqAny.ip || reqAny.connection?.remoteAddress || 'unknown';
    const userAgent = reqAny.headers?.['user-agent'] || 'unknown';

    const user = await this.authService.validateUser(
      email,
      pass,
      ip,
      userAgent,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
