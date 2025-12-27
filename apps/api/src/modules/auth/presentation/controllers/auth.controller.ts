import { Serialize } from '@/core/decorators/serialize.decorator';
import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { UserResponseDto } from '../../../../modules/users/application/dtos/response/user.response.dto';
import { Role } from '../../../users/domain/entities/user.entity';
import { LoginDto, RegisterDto } from '../../application/dtos/auth.dto';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../../application/dtos/password-reset.dto';
import { AuthService } from '../../application/services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user and return JWT token',
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'];

    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
      ip,
      userAgent,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // user is Omit<User, 'password'>, which has id, email, role.
    // Cast to required type or let TS infer if compatible (it should be if User has these fields)
    return this.authService.login(
      user as { id: string; email: string; role: Role },
    );
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register new user',
    description: 'Create a new user account',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @Serialize(UserResponseDto)
  async register(@Body() user: RegisterDto) {
    return this.authService.register(user);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Reset link sent if email exists' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
