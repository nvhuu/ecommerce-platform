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
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateIPBlockDto } from '../../application/dtos/create-ip-block.dto';
import { IPBlacklistResponseDto } from '../../application/dtos/ip-blacklist-response.dto';
import { IPBlacklistService } from '../../application/services/ip-blacklist.service';

@ApiTags('IP Blacklist')
@Controller('security/blocked-ips')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN)
@ApiBearerAuth()
export class IPBlacklistController {
  constructor(private readonly ipBlacklistService: IPBlacklistService) {}

  @Get()
  @ApiOperation({ summary: 'Get all blocked IPs' })
  @Serialize(IPBlacklistResponseDto)
  findAll() {
    return this.ipBlacklistService.getAllBlocked();
  }

  @Post()
  @ApiOperation({ summary: 'Block an IP address' })
  @Serialize(IPBlacklistResponseDto)
  async blockIP(@Body() dto: CreateIPBlockDto) {
    return await this.ipBlacklistService.blockIP({
      ...dto,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Unblock an IP address' })
  async unblockIP(@Param('id') id: string) {
    await this.ipBlacklistService.unblockIP(id);
    return { message: MESSAGES.COMMON.SUCCESS };
  }

  @Get('check/:ip')
  @ApiOperation({ summary: 'Check if IP is blocked' })
  async checkIP(@Param('ip') ip: string) {
    const isBlocked = await this.ipBlacklistService.isBlocked(ip);
    return { ip, isBlocked };
  }
}
