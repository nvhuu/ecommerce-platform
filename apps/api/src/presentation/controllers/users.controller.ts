import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../../application/dtos/auth.dto';
import { PaginationQueryDto } from '../../application/dtos/pagination.dto';
import { UserResponseDto } from '../../application/dtos/response';
import { UpdateUserDto } from '../../application/dtos/user.dto';
import { UsersService } from '../../application/services/users.service';
import { Role } from '../../domain/entities/user.entity';
import { Roles } from '../../infrastructure/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/guards/roles.guard';
import { ResponseMessage } from '../../infrastructure/decorators/response-message.decorator';
import {
  HybridPaginatedDto,
  Serialize,
} from '../../infrastructure/decorators/serialize.decorator';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @Serialize(UserResponseDto)
  @ResponseMessage('User created successfully')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
  })
  @Serialize(HybridPaginatedDto(UserResponseDto))
  @ResponseMessage('Users retrieved successfully')
  findAll(@Query() query: PaginationQueryDto) {
    return this.usersService.findAll(
      query.cursor,
      query.page,
      query.limit,
      query.search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @Serialize(UserResponseDto)
  @ResponseMessage('User retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @Serialize(UserResponseDto)
  @ResponseMessage('User updated successfully')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ResponseMessage('User deleted successfully')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
