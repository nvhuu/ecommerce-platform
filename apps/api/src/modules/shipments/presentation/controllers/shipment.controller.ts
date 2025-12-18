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
import { Role, ShipmentStatus } from '@prisma/client';
import {
  CreateShipmentDto,
  UpdateTrackingDto,
} from '../../application/dtos/shipment.dto';
import { ShipmentService } from '../../application/services/shipment.service';

@ApiTags('shipments')
@Controller('shipments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Post()
  @Roles(Role.SUPERADMIN)
  async create(@Body() dto: CreateShipmentDto) {
    return this.shipmentService.createShipment(dto);
  }

  @Get('order/:orderId')
  async getByOrder(@Param('orderId') orderId: string) {
    return this.shipmentService.getShipmentsByOrder(orderId);
  }

  @Patch(':id/status')
  @Roles(Role.SUPERADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ShipmentStatus,
  ) {
    return this.shipmentService.updateShipmentStatus(id, status);
  }

  @Patch(':id/tracking')
  @Roles(Role.SUPERADMIN)
  async updateTracking(
    @Param('id') id: string,
    @Body() dto: UpdateTrackingDto,
  ) {
    return this.shipmentService.updateTracking(id, dto);
  }
}
