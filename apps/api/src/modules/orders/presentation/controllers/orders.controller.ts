import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
import { RequestWithUser } from '@/modules/auth/types/request.types';
import { PaginationQueryDto } from '@/shared/dtos/query/pagination-query.dto';
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
import { Role } from '@prisma/client';
import { CreateOrderDto } from '../../application/dtos/order.dto';
import { OrderResponseDto } from '../../application/dtos/response/order.response.dto';
import { OrdersService } from '../../application/services/orders.service';
import { OrderStatus } from '../../domain/entities/order.entity';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

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
  updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateStatus(id, status);
  }
}
