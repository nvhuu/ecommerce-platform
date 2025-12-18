import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CreateInventoryTransactionDto } from '../../application/dtos/inventory.dto';
import { InventoryTransactionResponseDto } from '../../application/dtos/response/inventory.response.dto';
import { InventoryService } from '../../application/services/inventory.service';

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('transactions')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Create inventory transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction created',
    type: InventoryTransactionResponseDto,
  })
  @Serialize(InventoryTransactionResponseDto)
  async createTransaction(
    @Body() createDto: CreateInventoryTransactionDto,
  ): Promise<InventoryTransactionResponseDto> {
    return this.inventoryService.createTransaction(createDto);
  }

  @Get('products/:productId/history')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Get product inventory history' })
  @ApiResponse({
    status: 200,
    description: 'Inventory history',
    type: [InventoryTransactionResponseDto],
  })
  @Serialize(InventoryTransactionResponseDto)
  async getProductHistory(
    @Param('productId') productId: string,
    @Query('variantId') variantId?: string,
  ): Promise<InventoryTransactionResponseDto[]> {
    return this.inventoryService.getProductHistory(productId, variantId);
  }

  @Get('products/:productId/levels')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Get current stock levels' })
  @ApiResponse({
    status: 200,
    description: 'Current stock levels',
  })
  async getStockLevels(@Param('productId') productId: string) {
    return this.inventoryService.getStockLevels(productId);
  }
}
