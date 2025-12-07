import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';
import { CreateCategoryDto, UpdateCategoryDto } from '../../dtos/category.dto';
import { CategoryResponseDto } from '../../dtos/response';
import { HybridPaginatedDto } from '../../dtos/response/hybrid-paginated.response.dto';

@Injectable({ scope: Scope.REQUEST })
export class CategoriesService {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
    @Inject(REQUEST) private readonly request: Request & { user?: any },
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.create(createCategoryDto);
    return category;
  }

  async findAll(
    cursor?: string,
    page?: number,
    limit: number = 10,
  ): Promise<HybridPaginatedDto<CategoryResponseDto>> {
    const result = await this.categoryRepository.findAll({
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

  async findOne(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundException('Category not found');

    const updated = await this.categoryRepository.update(id, updateCategoryDto);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundException('Category not found');

    const deletedBy = this.request.user?.sub;
    await this.categoryRepository.delete(id, deletedBy);
  }
}
