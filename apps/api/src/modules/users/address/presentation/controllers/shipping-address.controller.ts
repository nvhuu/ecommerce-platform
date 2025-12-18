import { Serialize } from '@/core/decorators/serialize.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RequestWithUser } from '@/modules/auth/types/request.types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateShippingAddressDto,
  UpdateShippingAddressDto,
} from '../../application/dtos/shipping-address.dto';
import { ShippingAddressService } from '../../application/services/shipping-address.service';
import { ShippingAddress } from '../../domain/entities/shipping-address.entity';

@ApiTags('users')
@Controller('users/addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ShippingAddressController {
  constructor(private readonly service: ShippingAddressService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shipping address' })
  @Serialize(ShippingAddress)
  create(@Req() req: RequestWithUser, @Body() dto: CreateShippingAddressDto) {
    return this.service.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all my shipping addresses' })
  @Serialize(ShippingAddress)
  findAll(@Req() req: RequestWithUser) {
    return this.service.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get address by ID' })
  @Serialize(ShippingAddress)
  findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.service.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update address' })
  @Serialize(ShippingAddress)
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateShippingAddressDto,
  ) {
    return this.service.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address' })
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.service.remove(id, req.user.id);
  }
}
