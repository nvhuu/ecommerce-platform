import { Serialize } from '@/core/decorators/serialize.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RequestWithUser } from '@/modules/auth/types/request.types';
import { PaginationQueryDto } from '@/shared/dtos/query/pagination-query.dto';
import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationResponseDto } from '../../application/dtos/notification.dto';
import { NotificationService } from '../../application/services/notification.service';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get my notifications' })
  findAll(@Req() req: RequestWithUser, @Query() query: PaginationQueryDto) {
    return this.service.getMyNotifications(
      req.user.id,
      query.page,
      query.limit,
    );
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@Req() req: RequestWithUser) {
    return this.service.markAllAsRead(req.user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @Serialize(NotificationResponseDto)
  markAsRead(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.service.markAsRead(id, req.user.id);
  }
}
