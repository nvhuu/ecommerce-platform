import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
import { Role } from '@/modules/users/domain/entities/user.entity';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginHistoryQueryDto } from '../../application/dtos/login-history-query.dto';
import { LoginHistoryResponseDto } from '../../application/dtos/login-history-response.dto';
import { LoginHistoryService } from '../../application/services/login-history.service';

@ApiTags('Login History')
@Controller('security/login-history')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN)
@ApiBearerAuth()
export class LoginHistoryController {
  constructor(private readonly loginHistoryService: LoginHistoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get login history with filters' })
  @Serialize(LoginHistoryResponseDto)
  findAll(@Query() query: LoginHistoryQueryDto) {
    return this.loginHistoryService.findAll(query);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get login history for user' })
  @Serialize(LoginHistoryResponseDto)
  findByUser(@Param('userId') userId: string, @Query('limit') limit?: number) {
    return this.loginHistoryService.getUserHistory(userId, limit);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get login history for email' })
  @Serialize(LoginHistoryResponseDto)
  findByEmail(@Param('email') email: string, @Query('limit') limit?: number) {
    return this.loginHistoryService.getEmailHistory(email, limit);
  }

  @Get('failed')
  @ApiOperation({ summary: 'Get recent failed login attempts' })
  @Serialize(LoginHistoryResponseDto)
  findFailed(
    @Query('email') email: string,
    @Query('minutes') minutes?: number,
  ) {
    return this.loginHistoryService.getRecentFailedAttempts(email, minutes);
  }
}
