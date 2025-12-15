import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '../../../../modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../modules/auth/infrastructure/guards/roles.guard';
import { Role } from '../../../../modules/users/domain/entities/user.entity';
import { DashboardStatsResponseDto } from '../../application/dtos/response/dashboard.response.dto';
import { DashboardService } from '../../application/services/dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard stats retrieved successfully',
    type: DashboardStatsResponseDto,
  })
  @Serialize(DashboardStatsResponseDto)
  getStats() {
    return this.dashboardService.getStats();
  }
}
