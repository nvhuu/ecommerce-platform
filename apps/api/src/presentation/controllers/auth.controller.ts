import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, LoginDto } from '../../application/dtos/auth.dto';
import { UserResponseDto } from '../../application/dtos/response';
import { AuthService } from '../../application/modules/auth/auth.service';
import { ResponseMessage } from '../../infrastructure/decorators/response-message.decorator';
import { Serialize } from '../../infrastructure/decorators/serialize.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user and return JWT token',
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
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
  @ResponseMessage('User registered successfully')
  async register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }
}
