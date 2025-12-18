import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentStatus, Role } from '@prisma/client';
import {
  CreatePaymentDto,
  ProcessRefundDto,
} from '../../application/dtos/payment.dto';
import { PaymentService } from '../../application/services/payment.service';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @Roles(Role.SUPERADMIN)
  async create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment(dto);
  }

  @Get('order/:orderId')
  async getByOrder(@Param('orderId') orderId: string) {
    return this.paymentService.getPaymentsByOrder(orderId);
  }

  @Patch(':id/status')
  @Roles(Role.SUPERADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: PaymentStatus,
  ) {
    return this.paymentService.updatePaymentStatus(id, status);
  }

  @Post(':id/refund')
  @Roles(Role.SUPERADMIN)
  async refund(@Param('id') id: string, @Body() dto: ProcessRefundDto) {
    return this.paymentService.processRefund(id, dto);
  }
}
