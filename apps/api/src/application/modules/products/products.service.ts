import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProductRepository } from '../../../domain/repositories/product.repository.interface';
import { CreateProductDto, UpdateProductDto } from '../../dtos/product.dto';
import { ProductResponseDto } from '../../dtos/response';
import { toDto } from '../../utils/mapper.util';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.create(createProductDto);
    return toDto(ProductResponseDto, product) as ProductResponseDto;
  }

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findAll();
    return toDto(ProductResponseDto, products) as ProductResponseDto[];
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return toDto(ProductResponseDto, product) as ProductResponseDto;
  }

  async findByCategory(categoryId: string): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findByCategory(categoryId);
    return toDto(ProductResponseDto, products) as ProductResponseDto[];
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.update(id, updateProductDto);
    if (!product) throw new NotFoundException('Product not found');
    return toDto(ProductResponseDto, product) as ProductResponseDto;
  }

  async remove(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
