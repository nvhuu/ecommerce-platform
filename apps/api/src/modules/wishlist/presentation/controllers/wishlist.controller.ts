import { Serialize } from '@/core/decorators/serialize.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { MESSAGES } from '@/shared/constants/messages.constant';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AddToWishlistDto } from '../../application/dtos/add-to-wishlist.dto';
import { WishlistResponseDto } from '../../application/dtos/wishlist-response.dto';
import { WishlistService } from '../../application/services/wishlist.service';

interface AuthRequest extends Request {
  user: { id: string; email: string; role: string };
}

@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user's wishlist" })
  @Serialize(WishlistResponseDto)
  async getWishlist(@Req() req: AuthRequest) {
    return this.wishlistService.getUserWishlist(req.user.id);
  }

  @Post('items')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add item to wishlist' })
  async addItem(@Req() req: AuthRequest, @Body() dto: AddToWishlistDto) {
    await this.wishlistService.addItem(
      req.user.id,
      dto.productId,
      dto.variantId,
    );
    return { message: MESSAGES.COMMON.SUCCESS };
  }

  @Delete('items/:itemId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove item from wishlist' })
  async removeItem(@Req() req: AuthRequest, @Param('itemId') itemId: string) {
    await this.wishlistService.removeItem(req.user.id, itemId);
    return { message: MESSAGES.COMMON.SUCCESS };
  }

  @Delete('clear')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear all items from wishlist' })
  async clearWishlist(@Req() req: AuthRequest) {
    await this.wishlistService.clearWishlist(req.user.id);
    return { message: MESSAGES.COMMON.SUCCESS };
  }

  @Post('share')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate share link for wishlist' })
  async shareWishlist(@Req() req: AuthRequest) {
    return this.wishlistService.shareWishlist(req.user.id);
  }

  @Get('shared/:token')
  @ApiOperation({ summary: 'View shared wishlist' })
  @Serialize(WishlistResponseDto)
  async getSharedWishlist(@Param('token') token: string) {
    return this.wishlistService.getSharedWishlist(token);
  }
}
