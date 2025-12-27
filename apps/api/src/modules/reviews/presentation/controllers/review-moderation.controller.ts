import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
import { Role } from '@/modules/users/domain/entities/user.entity';
import { MESSAGES } from '@/shared/constants/messages.constant';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateReportDto } from '../../application/dtos/create-report.dto';
import { ResolveReportDto } from '../../application/dtos/resolve-report.dto';
import { ReviewReportResponseDto } from '../../application/dtos/review-report-response.dto';
import { ReviewModerationService } from '../../application/services/review-moderation.service';

interface AuthRequest extends Request {
  user: { id: string; email: string; role: string };
}

@ApiTags('Review Moderation')
@Controller('review-moderation')
export class ReviewModerationController {
  constructor(private readonly moderationService: ReviewModerationService) {}

  @Post('reports')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Report a review' })
  @Serialize(ReviewReportResponseDto)
  async createReport(@Req() req: AuthRequest, @Body() dto: CreateReportDto) {
    return this.moderationService.reportReview(dto, req.user.id);
  }

  @Get('reports')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all review reports' })
  @Serialize(ReviewReportResponseDto)
  async getReports(@Query('status') status?: string) {
    return this.moderationService.getReports({ status });
  }

  @Get('reports/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending review reports' })
  @Serialize(ReviewReportResponseDto)
  async getPendingReports() {
    return this.moderationService.getPendingReports();
  }

  @Get('reports/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get review report by ID' })
  @Serialize(ReviewReportResponseDto)
  async getReportById(@Param('id') id: string) {
    return this.moderationService.getReportById(id);
  }

  @Patch('reports/:id/resolve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Resolve a review report' })
  @Serialize(ReviewReportResponseDto)
  async resolveReport(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: ResolveReportDto,
  ) {
    return this.moderationService.resolveReport(id, dto, req.user.id);
  }

  @Patch('reports/:id/dismiss')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dismiss a review report' })
  async dismissReport(@Req() req: AuthRequest, @Param('id') id: string) {
    await this.moderationService.dismissReport(id, req.user.id);
    return { message: MESSAGES.COMMON.SUCCESS };
  }
}
