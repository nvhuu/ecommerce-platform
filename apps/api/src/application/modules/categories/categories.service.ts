import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';
import { CreateCategoryDto, UpdateCategoryDto } from '../../dtos/category.dto';
import { CategoryResponseDto } from '../../dtos/response';
import { toDto } from '../../utils/mapper.util';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.create(createCategoryDto);
    return toDto(CategoryResponseDto, category) as CategoryResponseDto;
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.findAll();
    return toDto(CategoryResponseDto, categories) as CategoryResponseDto[];
  }

  async findOne(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return toDto(CategoryResponseDto, category) as CategoryResponseDto;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.update(
      id,
      updateCategoryDto,
    );
    if (!category) throw new NotFoundException('Category not found');
    return toDto(CategoryResponseDto, category) as CategoryResponseDto;
  }

  async remove(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
