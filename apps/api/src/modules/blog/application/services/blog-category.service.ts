import { PaginationQueryDto } from '@/shared/dtos/query/pagination-query.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IBlogCategoryRepository } from '../../domain/repositories/blog-category.repository.interface';
import {
  CreateBlogCategoryDto,
  UpdateBlogCategoryDto,
} from '../dtos/blog-category.dto';

@Injectable()
export class BlogCategoryService {
  constructor(
    @Inject('IBlogCategoryRepository')
    private readonly categoryRepository: IBlogCategoryRepository,
  ) {}

  async create(dto: CreateBlogCategoryDto) {
    const existing = await this.categoryRepository.findBySlug(dto.slug);
    if (existing) {
      throw new BadRequestException('Slug already exists');
    }
    return this.categoryRepository.create(dto);
  }

  async findAll(query: PaginationQueryDto) {
    return this.categoryRepository.findAll(query);
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Blog category not found');
    }
    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) {
      throw new NotFoundException('Blog category not found');
    }
    return category;
  }

  async update(id: string, dto: UpdateBlogCategoryDto) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Blog category not found');
    }

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.categoryRepository.findBySlug(dto.slug);
      if (existing) {
        throw new BadRequestException('Slug already exists');
      }
    }

    return this.categoryRepository.update(id, dto);
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Blog category not found');
    }
    return this.categoryRepository.delete(id);
  }
}
