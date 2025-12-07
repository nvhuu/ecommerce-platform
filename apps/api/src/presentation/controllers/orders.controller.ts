import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderDto } from '../../application/dtos/order.dto';
import { OrdersService } from '../../application/modules/orders/orders.service';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { ResponseMessage } from '../../infrastructure/decorators/response-message.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ResponseMessage('Order created successfully')
  create(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user.userId, createOrderDto);
  }

  @Get()
  findAll(@Request() req: any) {
    // Optionally filter by user role (admin sees all, user sees own)
    // For now, let's assume this is for admin or dev
    return this.ordersService.findAll();
  }

  @Get('my-orders')
  findMyOrders(@Request() req: any) {
    return this.ordersService.findByUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @ResponseMessage('Order status updated successfully')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }
}
