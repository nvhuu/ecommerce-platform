import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { ProductResponseDto } from '../dtos/response';
import { HybridPaginatedDto } from '../dtos/response/hybrid-paginated.response.dto';

@Injectable({ scope: Scope.REQUEST })
export class ProductsService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    @Inject(REQUEST)
    private readonly request: Request & { user?: { sub: string } },
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.create(createProductDto);
    return product;
  }

  async findAll(
    cursor?: string,
    page?: number,
    limit: number = 10,
  ): Promise<HybridPaginatedDto<ProductResponseDto>> {
    const result = await this.productRepository.findAll({
      cursor,
      page,
      limit,
    });

    if (result.usedCursor) {
      return new HybridPaginatedDto(result.data, 'cursor', {
        hasNextPage: result.hasMore!,
        nextCursor: result.lastId
          ? Buffer.from(result.lastId).toString('base64')
          : undefined,
        limit,
      });
    } else {
      return new HybridPaginatedDto(result.data, 'offset', {
        total: result.total!,
        page: page || 1,
        limit,
      });
    }
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findByCategory(
    categoryId: string,
    cursor?: string,
    page?: number,
    limit: number = 10,
  ): Promise<HybridPaginatedDto<ProductResponseDto>> {
    const result = await this.productRepository.findByCategory(categoryId, {
      cursor,
      page,
      limit,
    });

    if (result.usedCursor) {
      return new HybridPaginatedDto(result.data, 'cursor', {
        hasNextPage: result.hasMore!,
        nextCursor: result.lastId
          ? Buffer.from(result.lastId).toString('base64')
          : undefined,
        limit,
      });
    } else {
      return new HybridPaginatedDto(result.data, 'offset', {
        total: result.total!,
        page: page || 1,
        limit,
      });
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    const updated = await this.productRepository.update(id, updateProductDto);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    const deletedBy = this.request.user?.sub;
    await this.productRepository.delete(id, deletedBy);
  }
}
