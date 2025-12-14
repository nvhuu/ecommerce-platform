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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CreateOrderDto } from '../../application/dtos/order.dto';
import { PaginationQueryDto } from '../../application/dtos/pagination.dto';
import { OrderResponseDto } from '../../application/dtos/response';
import { OrdersService } from '../../application/services/orders.service';
import { Role } from '../../domain/entities/user.entity';
import { Roles } from '../../infrastructure/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/guards/roles.guard';
import {
  HybridPaginatedDto,
  Serialize,
} from '../../infrastructure/decorators/serialize.decorator';

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: OrderResponseDto,
  })
  @Serialize(OrderResponseDto)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    return this.ordersService.create(req.user, createOrderDto);
  }

  @Get()
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
  })
  @Serialize(HybridPaginatedDto(OrderResponseDto))
  findAll(@Query() query: PaginationQueryDto) {
    return this.ordersService.findAll(
      query.cursor,
      query.page,
      query.limit,
      query.search,
    );
  }

  @Get('mine')
  @ApiOperation({ summary: 'Get my orders' })
  @ApiResponse({
    status: 200,
    description: 'User orders retrieved successfully',
  })
  @Serialize(HybridPaginatedDto(OrderResponseDto))
  findMyOrders(
    @Req() req: Request & { user: { id: string } },
    @Query() query: PaginationQueryDto,
  ) {
    return this.ordersService.findByUser(
      req.user.id,
      query.cursor,
      query.page,
      query.limit,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully',
    type: OrderResponseDto,
  })
  @Serialize(OrderResponseDto)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
    type: OrderResponseDto,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'SHIPPED',
          description: 'New status for the order',
        },
      },
      required: ['status'],
    },
  })
  @Serialize(OrderResponseDto)
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(id, body.status);
  }
}
