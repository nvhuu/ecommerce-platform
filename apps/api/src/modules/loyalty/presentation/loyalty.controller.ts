import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
import { MESSAGES } from '@/shared/constants/messages.constant';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import {
  AdjustPointsDto,
  GetTransactionsQueryDto,
  RedeemPointsDto,
} from '../application/dtos/loyalty.dto';
import {
  BalanceResponseDto,
  LoyaltyTransactionResponseDto,
  RedeemResultDto,
} from '../application/dtos/response/loyalty.response.dto';
import { LoyaltyService } from '../application/services/loyalty.service';

@ApiTags('Loyalty')
@Controller('loyalty')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Serialize(BalanceResponseDto)
  async getBalance(@Req() req: { user: { userId: string } }) {
    const balance = await this.loyaltyService.getBalance(req.user.userId);

    return {
      message: MESSAGES.LOYALTY.BALANCE_RETRIEVED,
      data: plainToClass(BalanceResponseDto, {
        balance,
        totalEarned: balance >= 0 ? balance : 0,
        totalRedeemed: 0, // Could be enhanced with separate calculation
      }),
    };
  }

  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Serialize(LoyaltyTransactionResponseDto)
  async getTransactions(
    @Req() req: { user: { userId: string } },
    @Query() query: GetTransactionsQueryDto,
  ) {
    const result = await this.loyaltyService.getTransactionHistory(
      req.user.userId,
      query.page,
      query.limit,
    );

    return {
      message: MESSAGES.LOYALTY.HISTORY_RETRIEVED,
      data: result.data.map((t) =>
        plainToClass(LoyaltyTransactionResponseDto, t),
      ),
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    };
  }

  @Post('redeem')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Serialize(RedeemResultDto)
  async redeemPoints(
    @Req() req: { user: { userId: string } },
    @Body() dto: RedeemPointsDto,
  ) {
    const result = await this.loyaltyService.redeemPoints(
      req.user.userId,
      dto.points,
    );

    return {
      message: MESSAGES.LOYALTY.POINTS_REDEEMED,
      data: plainToClass(RedeemResultDto, {
        discountAmount: result.discountAmount,
        pointsRedeemed: dto.points,
        newBalance: result.newBalance,
      }),
    };
  }

  // Admin endpoints
  @Post('admin/adjust')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  async adjustPoints(
    @Req() req: { user: { userId: string } },
    @Body() dto: AdjustPointsDto,
  ) {
    await this.loyaltyService.adjustPoints(
      dto.userId,
      dto.points,
      dto.description,
      req.user.userId,
    );

    return {
      message: MESSAGES.LOYALTY.POINTS_ADJUSTED,
    };
  }

  @Get('admin/user/:userId/balance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @Serialize(BalanceResponseDto)
  async getUserBalance(@Param('userId') userId: string) {
    const balance = await this.loyaltyService.getBalance(userId);

    return {
      message: MESSAGES.LOYALTY.BALANCE_RETRIEVED,
      data: plainToClass(BalanceResponseDto, {
        balance,
        totalEarned: balance >= 0 ? balance : 0,
        totalRedeemed: 0,
      }),
    };
  }

  @Get('admin/user/:userId/transactions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @Serialize(LoyaltyTransactionResponseDto)
  async getUserTransactions(
    @Param('userId') userId: string,
    @Query() query: GetTransactionsQueryDto,
  ) {
    const result = await this.loyaltyService.getTransactionHistory(
      userId,
      query.page,
      query.limit,
    );

    return {
      message: MESSAGES.LOYALTY.HISTORY_RETRIEVED,
      data: result.data.map((t) =>
        plainToClass(LoyaltyTransactionResponseDto, t),
      ),
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    };
  }
}
