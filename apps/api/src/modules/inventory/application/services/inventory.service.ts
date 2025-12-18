import { ProductVariantService } from '@/modules/products/application/services/product-variant.service';
import { ProductsService } from '@/modules/products/application/services/products.service';
import { Inject, Injectable } from '@nestjs/common';
import { InventoryTransactionType } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { IInventoryTransactionRepository } from '../../domain/repositories/inventory-transaction.repository.interface';
import { CreateInventoryTransactionDto } from '../dtos/inventory.dto';
import { InventoryTransactionResponseDto } from '../dtos/response/inventory.response.dto';

@Injectable()
export class InventoryService {
  constructor(
    @Inject('IInventoryTransactionRepository')
    private readonly transactionRepository: IInventoryTransactionRepository,
    private readonly productsService: ProductsService,
    private readonly variantService: ProductVariantService,
  ) {}

  async createTransaction(
    createDto: CreateInventoryTransactionDto,
  ): Promise<InventoryTransactionResponseDto> {
    // Verify product exists via service
    await this.productsService.findOne(createDto.productId);

    // If variant specified, verify it exists
    if (createDto.variantId) {
      await this.variantService.findOne(createDto.variantId);
    }

    // Create transaction
    const transaction = await this.transactionRepository.create(createDto);

    // Update stock based on transaction type
    await this.updateStock(createDto);

    return plainToInstance(InventoryTransactionResponseDto, transaction);
  }

  async getProductHistory(
    productId: string,
    variantId?: string,
  ): Promise<InventoryTransactionResponseDto[]> {
    const transactions = await this.transactionRepository.findByProduct(
      productId,
      variantId,
    );
    return plainToInstance(InventoryTransactionResponseDto, transactions);
  }

  async getStockLevels(productId: string) {
    const product = await this.productsService.findOne(productId);
    const variants = await this.variantService.findAllByProduct(productId);

    return {
      product: {
        id: product.data.id,
        name: product.data.name,
        stock: product.data.stock,
        reserved: 0,
        available: product.data.stock,
      },
      variants: variants.map((v) => ({
        id: v.id,
        sku: v.sku,
        name: v.name,
        stock: v.stock,
        reserved: v.reserved,
        available: v.stock - v.reserved,
      })),
    };
  }

  private async updateStock(dto: CreateInventoryTransactionDto): Promise<void> {
    if (!dto.variantId) return; // Only handle variants for now

    if (dto.type === InventoryTransactionType.RESERVED) {
      await this.variantService.reserveStock(dto.variantId, dto.quantity);
    } else if (dto.type === InventoryTransactionType.RELEASED) {
      await this.variantService.releaseStock(dto.variantId, dto.quantity);
    } else if (
      dto.type === InventoryTransactionType.SALE ||
      dto.type === InventoryTransactionType.DAMAGE
    ) {
      await this.variantService.deductStock(dto.variantId, dto.quantity);
    }
    // For PURCHASE, RETURN - can add later
    // For PURCHASE, RETURN - can add later
  }

  async getLowStock(threshold = 5) {
    return this.variantService.findLowStock(threshold);
  }
}
