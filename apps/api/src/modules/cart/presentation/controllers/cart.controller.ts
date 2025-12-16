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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AddToCartDto,
  UpdateCartItemDto,
} from '../../application/dtos/cart.dto';
import { CartService } from '../../application/services/cart.service';
// import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard'; // Assuming existence

@ApiTags('Cart')
@Controller('cart')
// @UseGuards(JwtAuthGuard) // Uncomment when Guard is verified/available
// @ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: RequestWithUser) {
    // Mock user ID for now if Auth not fully wired in Request
    const userId = req.user?.id || 'mock-user-id';
    return this.cartService.getCart(userId);
  }

  @Post()
  async addToCart(@Req() req: RequestWithUser, @Body() dto: AddToCartDto) {
    const userId = req.user?.id || 'mock-user-id';
    return this.cartService.addToCart(userId, dto);
  }

  @Patch(':itemId')
  async updateItem(
    @Req() req: RequestWithUser,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    const userId = req.user?.id || 'mock-user-id';
    return this.cartService.updateItem(userId, itemId, dto);
  }

  @Delete(':itemId')
  async removeItem(
    @Req() req: RequestWithUser,
    @Param('itemId') itemId: string,
  ) {
    const userId = req.user?.id || 'mock-user-id';
    return this.cartService.removeItem(userId, itemId);
  }

  @Delete()
  async clearCart(@Req() req: RequestWithUser) {
    const userId = req.user?.id || 'mock-user-id';
    return this.cartService.clearCart(userId);
  }
}
