import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
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
    req: any,
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'>> {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'];

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
