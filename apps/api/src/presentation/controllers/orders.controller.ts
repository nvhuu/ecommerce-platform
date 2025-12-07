import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderDto } from '../../application/dtos/order.dto';
import { PaginationQueryDto } from '../../application/dtos/pagination.dto';
import { OrderResponseDto } from '../../application/dtos/response';
import { OrdersService } from '../../application/modules/orders/orders.service';
import { Role } from '../../domain/entities/user.entity';
import { Roles } from '../../infrastructure/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/guards/roles.guard';
import { ResponseMessage } from '../../infrastructure/decorators/response-message.decorator';
import {
  HybridPaginatedDto,
  Serialize,
} from '../../infrastructure/decorators/serialize.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Serialize(OrderResponseDto)
  @ResponseMessage('Order created successfully')
  create(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
    return this.ordersService.create(req.user, createOrderDto);
  }

  @Get()
  @Roles(Role.SUPERADMIN)
  @Serialize(HybridPaginatedDto(OrderResponseDto))
  @ResponseMessage('Orders retrieved successfully')
  findAll(@Query() query: PaginationQueryDto) {
    return this.ordersService.findAll(query.cursor, query.page, query.limit);
  }

  @Get(':id')
  @Serialize(OrderResponseDto)
  @ResponseMessage('Order retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @Roles(Role.SUPERADMIN)
  @Serialize(OrderResponseDto)
  @ResponseMessage('Order status updated successfully')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(id, body.status);
  }
}
