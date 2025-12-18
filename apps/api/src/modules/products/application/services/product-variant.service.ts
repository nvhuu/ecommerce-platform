import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IProductVariantRepository } from '../../domain/repositories/product-variant.repository.interface';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from '../dtos/product-variant.dto';
import { ProductVariantResponseDto } from '../dtos/response/product-variant.response.dto';

@Injectable()
export class ProductVariantService {
  constructor(
    @Inject('IProductVariantRepository')
    private readonly variantRepository: IProductVariantRepository,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async create(
    createDto: CreateProductVariantDto,
  ): Promise<ProductVariantResponseDto> {
    // Check if product exists
    const product = await this.productRepository.findById(createDto.productId);
    if (!product) {
      throw new NotFoundException(
        `Product with ID ${createDto.productId} not found`,
      );
    }

    // Check if SKU already exists
    const existingVariant = await this.variantRepository.findBySku(
      createDto.sku,
    );
    if (existingVariant) {
      throw new ConflictException(`SKU ${createDto.sku} already exists`);
    }

    const variant = await this.variantRepository.create(createDto);
    return plainToInstance(ProductVariantResponseDto, variant);
  }

  async findAllByProduct(
    productId: string,
  ): Promise<ProductVariantResponseDto[]> {
    const variants = await this.variantRepository.findAll(productId);
    return plainToInstance(ProductVariantResponseDto, variants);
  }

  async findOne(id: string): Promise<ProductVariantResponseDto> {
    const variant = await this.variantRepository.findById(id);
    if (!variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    return plainToInstance(ProductVariantResponseDto, variant);
  }

  async update(
    id: string,
    updateDto: UpdateProductVariantDto,
  ): Promise<ProductVariantResponseDto> {
    await this.findOne(id); // Check exists

    const variant = await this.variantRepository.update(id, updateDto);
    return plainToInstance(ProductVariantResponseDto, variant);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Check exists
    await this.variantRepository.delete(id);
  }

  async reserveStock(variantId: string, quantity: number): Promise<void> {
    await this.variantRepository.reserveStock(variantId, quantity);
  }

  async releaseStock(variantId: string, quantity: number): Promise<void> {
    await this.variantRepository.releaseStock(variantId, quantity);
  }

  async deductStock(variantId: string, quantity: number): Promise<void> {
    await this.variantRepository.deductStock(variantId, quantity);
  }

  async findLowStock(threshold: number): Promise<ProductVariantResponseDto[]> {
    const variants = await this.variantRepository.findLowStock(threshold);
    return plainToInstance(ProductVariantResponseDto, variants);
  }
}
