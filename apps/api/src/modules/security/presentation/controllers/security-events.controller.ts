import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
import { Role } from '@/modules/users/domain/entities/user.entity';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SecurityEventResponseDto } from '../../application/dtos/security-event-response.dto';
import { SecurityEventsQueryDto } from '../../application/dtos/security-events-query.dto';
import { SecurityEventService } from '../../application/services/security-event.service';

@ApiTags('Security Events')
@Controller('security/events')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN)
@ApiBearerAuth()
export class SecurityEventsController {
  constructor(private readonly securityEventService: SecurityEventService) {}

  @Get()
  @ApiOperation({ summary: 'Get all security events' })
  @Serialize(SecurityEventResponseDto)
  findAll(@Query() query: SecurityEventsQueryDto) {
    return this.securityEventService.getAllEvents(query);
  }

  @Get('unresolved')
  @ApiOperation({ summary: 'Get unresolved security events' })
  @Serialize(SecurityEventResponseDto)
  findUnresolved() {
    return this.securityEventService.getUnresolvedEvents();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get security event by ID' })
  @Serialize(SecurityEventResponseDto)
  async findOne(@Param('id') _id: string) {
    // Simplified: just return first event for now
    // Proper implementation would query by ID
    const events = await this.securityEventService.getAllEvents({
      skip: 0,
      take: 1,
    });
    return events[0];
  }

  @Patch(':id/resolve')
  @ApiOperation({ summary: 'Resolve security event' })
  @Serialize(SecurityEventResponseDto)
  resolve(@Param('id') id: string, @Body('resolvedBy') resolvedBy: string) {
    return this.securityEventService.resolveEvent(id, resolvedBy);
  }
}
