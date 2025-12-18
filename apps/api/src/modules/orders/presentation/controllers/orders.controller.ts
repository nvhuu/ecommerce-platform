import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
import { RequestWithUser } from '@/modules/auth/types/request.types';
import { PaginationQueryDto } from '@/shared/dtos/query/pagination-query.dto';
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
import { Role } from '@prisma/client';
import {
  CreateOrderNoteDto,
  UpdateOrderNoteDto,
} from '../../application/dtos/order-note.dto';
import { CreateOrderDto } from '../../application/dtos/order.dto';
import { OrderResponseDto } from '../../application/dtos/response/order.response.dto';
import { OrderNoteService } from '../../application/services/order-note.service';
import { OrdersService } from '../../application/services/orders.service';
import { OrderStatus } from '../../domain/entities/order.entity';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderNoteService: OrderNoteService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @Serialize(OrderResponseDto)
  create(@Req() req: RequestWithUser, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.ordersService.findAll(query.page, query.limit, query.search);
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Get current user orders' })
  findMyOrders(
    @Req() req: RequestWithUser,
    @Query() query: PaginationQueryDto,
  ) {
    return this.ordersService.findByUser(req.user.id, query.page, query.limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @Serialize(OrderResponseDto)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  @Serialize(OrderResponseDto)
  updateStatus(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(id, status, req.user.id);
  }

  // Order Notes endpoints
  @Post(':id/notes')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Add note to order (Admin only)' })
  createNote(
    @Req() req: RequestWithUser,
    @Param('id') orderId: string,
    @Body() dto: CreateOrderNoteDto,
  ) {
    return this.orderNoteService.createNote(orderId, dto, req.user.id);
  }

  @Get(':id/notes')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Get order notes (Admin only)' })
  getNotes(@Param('id') orderId: string) {
    return this.orderNoteService.getNotesByOrder(orderId);
  }

  @Patch('notes/:noteId')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Update order note (Admin only)' })
  updateNote(@Param('noteId') noteId: string, @Body() dto: UpdateOrderNoteDto) {
    return this.orderNoteService.updateNote(noteId, dto);
  }

  @Delete('notes/:noteId')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Delete order note (Admin only)' })
  deleteNote(@Param('noteId') noteId: string) {
    return this.orderNoteService.deleteNote(noteId);
  }
}
