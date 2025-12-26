import { Serialize } from '@/core/decorators/serialize.decorator';
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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSettingDto } from '../../application/dtos/create-setting.dto';
import { SettingResponseDto } from '../../application/dtos/setting-response.dto';
import { UpdateSettingDto } from '../../application/dtos/update-setting.dto';
import { SettingsService } from '../../application/services/settings.service';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.SETTING.CREATED })
  @Serialize(SettingResponseDto)
  create(@Body() dto: CreateSettingDto) {
    return this.settingsService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.SETTING.LIST_RETRIEVED })
  @Serialize(SettingResponseDto)
  findAll() {
    return this.settingsService.findAll();
  }

  @Get('public')
  @ApiOperation({ summary: 'Get public settings' })
  @Serialize(SettingResponseDto)
  findPublic() {
    return this.settingsService.findPublic();
  }

  @Get('category/:category')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.SETTING.LIST_RETRIEVED })
  @Serialize(SettingResponseDto)
  findByCategory(@Param('category') category: string) {
    return this.settingsService.findByCategory(category);
  }

  @Get(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.SETTING.RETRIEVED })
  @Serialize(SettingResponseDto)
  findOne(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @Patch(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.SETTING.UPDATED })
  @Serialize(SettingResponseDto)
  update(@Param('key') key: string, @Body() dto: UpdateSettingDto) {
    return this.settingsService.update(key, dto);
  }

  @Delete(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.SETTING.DELETED })
  remove(@Param('key') key: string) {
    return this.settingsService.delete(key);
  }
}
