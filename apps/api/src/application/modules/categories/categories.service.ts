import { Inject, Injectable } from '@nestjs/common';
import { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';
import { CreateCategoryDto, UpdateCategoryDto } from '../../dtos/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('ICategoryRepository')
    private categoryRepository: ICategoryRepository,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.create(createCategoryDto);
  }

  findAll() {
    return this.categoryRepository.findAll();
  }

  findOne(id: string) {
    return this.categoryRepository.findById(id);
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  remove(id: string) {
    return this.categoryRepository.delete(id);
  }
}
