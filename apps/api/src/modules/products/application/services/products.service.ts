import { MESSAGES } from '@/shared/constants/messages.constant';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { ProductQueryDto } from '../dtos/product-query.dto';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { ProductResponseDto } from '../dtos/response/product.response.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async create(dto: CreateProductDto) {
    const created = await this.productRepository.create(dto);
    return {
      message: MESSAGES.PRODUCT.CREATED,
      data: plainToClass(ProductResponseDto, created),
    };
  }

  async findAll(options: ProductQueryDto) {
    const result = await this.productRepository.findAll(options);

    return {
      message: MESSAGES.PRODUCT.LIST_RETRIEVED,
      data: result.data.map((p) => plainToClass(ProductResponseDto, p)),
      page: result.page,
      limit: result.limit,
      total: result.total,
    };
  }

  async getRelatedProducts(id: string) {
    const related = await this.productRepository.findRelated(id);
    return {
      message: MESSAGES.PRODUCT.LIST_RETRIEVED,
      data: related.map((p) => plainToClass(ProductResponseDto, p)),
    };
  }

  async findByCategory(categoryId: string, page?: number, limit?: number) {
    const result = await this.productRepository.findByCategory(categoryId, {
      page,
      limit: limit || 10,
    });

    return {
      message: MESSAGES.PRODUCT.LIST_RETRIEVED,
      data: result.data.map((p) => plainToClass(ProductResponseDto, p)),
      page: result.page,
      limit: result.limit,
      total: result.total,
    };
  }

  async findOne(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(MESSAGES.PRODUCT.NOT_FOUND);
    }
    return {
      message: MESSAGES.PRODUCT.RETRIEVED,
      data: plainToClass(ProductResponseDto, product),
    };
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(MESSAGES.PRODUCT.NOT_FOUND);
    }

    const updated = await this.productRepository.update(id, dto);
    return {
      message: MESSAGES.PRODUCT.UPDATED,
      data: plainToClass(ProductResponseDto, updated),
    };
  }

  async remove(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(MESSAGES.PRODUCT.NOT_FOUND);
    }

    await this.productRepository.delete(id);
    return {
      message: MESSAGES.PRODUCT.DELETED,
      data: null,
    };
  }
}
