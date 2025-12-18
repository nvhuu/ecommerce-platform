import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
import { RequestWithUser } from '@/modules/auth/types/request.types';
import { PaginationQueryDto } from '@/shared/dtos/query/pagination-query.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UserResponseDto } from '../../application/dtos/response/user.response.dto';
import { CreateUserDto, UpdateUserDto } from '../../application/dtos/user.dto';
import { UsersService } from '../../application/services/users.service';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @Serialize(UserResponseDto)
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Get all users with pagination' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.usersService.findAll(query.page, query.limit, query.search);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @Serialize(UserResponseDto)
  getProfile(@Req() req: RequestWithUser) {
    // req.user is set by JwtAuthGuard
    return this.usersService.getCurrentUser(req.user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @Serialize(UserResponseDto)
  updateProfile(@Req() req: RequestWithUser, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @Serialize(UserResponseDto)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @Serialize(UserResponseDto)
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
