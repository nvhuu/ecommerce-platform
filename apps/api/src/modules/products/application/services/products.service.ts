import { MESSAGES } from '@/shared/constants/messages.constant';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
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

  async findAll(page?: number, limit?: number) {
    const result = await this.productRepository.findAll({
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
