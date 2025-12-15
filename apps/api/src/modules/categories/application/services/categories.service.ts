import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { MESSAGES } from '@/shared/constants/messages.constant';
import { ICategoryRepository } from '../../domain/repositories/category.repository.interface';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { CategoryResponseDto } from '../dtos/response/category.response.dto';
import { Category } from '../../domain/entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async create(dto: CreateCategoryDto) {
    const category = new Category();
    category.name = dto.name;
    category.slug = dto.name.toLowerCase().replace(/\s+/g, '-');
    category.parentId = dto.parentId || null;

    const created = await this.categoryRepository.create(category);

    return {
      message: MESSAGES.CATEGORY.CREATED,
      data: plainToClass(CategoryResponseDto, created),
    };
  }

  async findAll(page?: number, limit?: number, search?: string) {
    const result = await this.categoryRepository.findAll({
      page,
      limit: limit || 10,
      search,
    });

    return {
      message: MESSAGES.CATEGORY.LIST_RETRIEVED,
      data: result.data.map((c) => plainToClass(CategoryResponseDto, c)),
      page: result.page,
      limit: result.limit,
      total: result.total,
    };
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(MESSAGES.CATEGORY.NOT_FOUND);
    }

    return {
      message: MESSAGES.CATEGORY.RETRIEVED,
      data: plainToClass(CategoryResponseDto, category),
    };
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(MESSAGES.CATEGORY.NOT_FOUND);
    }

    const updated = await this.categoryRepository.update(id, dto);

    return {
      message: MESSAGES.CATEGORY.UPDATED,
      data: plainToClass(CategoryResponseDto, updated),
    };
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(MESSAGES.CATEGORY.NOT_FOUND);
    }

    await this.categoryRepository.delete(id);

    return {
      message: MESSAGES.CATEGORY.DELETED,
      data: null,
    };
  }
}
