import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
import { Role } from '@/modules/users/domain/entities/user.entity';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityLogResponseDto } from '../../application/dtos/activity-log-response.dto';
import { ActivityLogsQueryDto } from '../../application/dtos/activity-logs-query.dto';
import { ActivityLogService } from '../../application/services/activity-log.service';

@ApiTags('Activity Logs')
@Controller('security/activity-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN)
@ApiBearerAuth()
export class ActivityLogsController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  @ApiOperation({ summary: 'Get activity logs with filters' })
  @Serialize(ActivityLogResponseDto)
  async findAll(@Query() query: ActivityLogsQueryDto) {
    return await this.activityLogService.findAll(query);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get activity logs for user' })
  @Serialize(ActivityLogResponseDto)
  async findByUser(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
  ) {
    return await this.activityLogService.findByUser(userId, limit);
  }

  @Get('resource/:resource')
  @ApiOperation({ summary: 'Get activity logs for resource' })
  @Serialize(ActivityLogResponseDto)
  async findByResource(
    @Param('resource') resource: string,
    @Query('limit') limit?: number,
  ) {
    return await this.activityLogService.findByResource(resource, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity log by ID' })
  @Serialize(ActivityLogResponseDto)
  async findOne(@Param('id') id: string) {
    return await this.activityLogService.findById(id);
  }
}
