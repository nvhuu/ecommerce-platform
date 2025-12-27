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
  CreatePopupDto,
  UpdatePopupDto,
} from '../../application/dtos/popup.dto';
import { PopupService } from '../../application/services/popup.service';

interface AuthRequest extends Request {
  user: { id: string; email: string; role: string };
}

@ApiTags('Popups')
@Controller('popups')
export class PopupController {
  constructor(private readonly popupService: PopupService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create popup' })
  async create(@Req() req: AuthRequest, @Body() dto: CreatePopupDto) {
    return this.popupService.create(dto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all popups (admin)' })
  async findAll(@Query('isActive') isActive?: boolean) {
    return this.popupService.findAll({ isActive });
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active popups (public)' })
  async getActivePopups() {
    return this.popupService.getActivePopups();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get popup by ID' })
  async findById(@Param('id') id: string) {
    return this.popupService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update popup' })
  async update(@Param('id') id: string, @Body() dto: UpdatePopupDto) {
    return this.popupService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete popup' })
  async delete(@Param('id') id: string) {
    await this.popupService.delete(id);
    return { message: MESSAGES.COMMON.SUCCESS };
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle popup active status' })
  async toggleActive(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.popupService.toggleActive(id, isActive);
  }

  @Post(':id/track/impression')
  @ApiOperation({ summary: 'Track popup impression' })
  async trackImpression(@Param('id') id: string) {
    await this.popupService.trackImpression(id);
    return { message: MESSAGES.COMMON.SUCCESS };
  }

  @Post(':id/track/dismiss')
  @ApiOperation({ summary: 'Track popup dismiss' })
  async trackDismiss(@Param('id') id: string) {
    await this.popupService.trackDismiss(id);
    return { message: MESSAGES.COMMON.SUCCESS };
  }

  @Post(':id/track/conversion')
  @ApiOperation({ summary: 'Track popup conversion' })
  async trackConversion(@Param('id') id: string) {
    await this.popupService.trackConversion(id);
    return { message: MESSAGES.COMMON.SUCCESS };
  }
}
