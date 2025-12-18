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
  HttpCode,
  HttpStatus,
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
  CouponResponseDto,
  CreateCouponDto,
  UpdateCouponDto,
  ValidateCouponDto,
} from '../../application/dtos/coupon.dto';
import { CouponService } from '../../application/services/coupon.service';

@ApiTags('coupons')
@Controller('coupons')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Create a new coupon (Admin only)' })
  @Serialize(CouponResponseDto)
  create(@Req() req: RequestWithUser, @Body() dto: CreateCouponDto) {
    return this.couponService.createCoupon(dto, req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'List all coupons (Admin only)' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.couponService.getCoupons(query.page, query.limit);
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate a coupon code' })
  validate(@Body() dto: ValidateCouponDto) {
    return this.couponService.validateCoupon(dto);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Get coupon details (Admin only)' })
  @Serialize(CouponResponseDto)
  findOne(@Param('id') id: string) {
    return this.couponService.getCoupon(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Update coupon (Admin only)' })
  @Serialize(CouponResponseDto)
  update(@Param('id') id: string, @Body() dto: UpdateCouponDto) {
    return this.couponService.updateCoupon(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Delete coupon (Admin only)' })
  remove(@Param('id') id: string) {
    return this.couponService.deleteCoupon(id);
  }
}
