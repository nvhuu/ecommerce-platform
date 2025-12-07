import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto, LoginDto } from '../../application/dtos/auth.dto';
import { UserResponseDto } from '../../application/dtos/response';
import { AuthService } from '../../application/modules/auth/auth.service';
import { ResponseMessage } from '../../infrastructure/decorators/response-message.decorator';
import { Serialize } from '../../infrastructure/decorators/serialize.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @Serialize(UserResponseDto)
  @ResponseMessage('User registered successfully')
  async register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }
}
