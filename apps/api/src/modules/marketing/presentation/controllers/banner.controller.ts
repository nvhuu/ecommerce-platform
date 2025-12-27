import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
import { Role } from '@/modules/users/domain/entities/user.entity';
import { MESSAGES } from '@/shared/constants/messages.constant';
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
import { Request } from 'express';
import {
  CreateBannerDto,
  UpdateBannerDto,
} from '../../application/dtos/banner.dto';
import { BannerService } from '../../application/services/banner.service';

interface AuthRequest extends Request {
  user: { id: string; email: string; role: string };
}

@ApiTags('Banners')
@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create banner' })
  async create(@Req() req: AuthRequest, @Body() dto: CreateBannerDto) {
    return this.bannerService.create(dto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all banners (admin)' })
  async findAll(
    @Query('isActive') isActive?: boolean,
    @Query('position') position?: string,
  ) {
    return this.bannerService.findAll({ isActive, position });
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active banners (public)' })
  async getActiveBanners(@Query('position') position?: string) {
    if (!position) {
      throw new Error('Position is required');
    }
    return this.bannerService.getActiveBanners(position);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get banner by ID' })
  async findById(@Param('id') id: string) {
    return this.bannerService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update banner' })
  async update(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.bannerService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete banner' })
  async delete(@Param('id') id: string) {
    await this.bannerService.delete(id);
    return { message: MESSAGES.COMMON.SUCCESS };
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle banner active status' })
  async toggleActive(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.bannerService.toggleActive(id, isActive);
  }

  @Post(':id/track/impression')
  @ApiOperation({ summary: 'Track banner impression' })
  async trackImpression(@Param('id') id: string) {
    await this.bannerService.trackImpression(id);
    return { message: MESSAGES.COMMON.SUCCESS };
  }

  @Post(':id/track/click')
  @ApiOperation({ summary: 'Track banner click' })
  async trackClick(@Param('id') id: string) {
    await this.bannerService.trackClick(id);
    return { message: MESSAGES.COMMON.SUCCESS };
  }
}
