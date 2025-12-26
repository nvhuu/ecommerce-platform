import { MESSAGES } from '@/shared/constants/messages.constant';
import { PaginationOptions } from '@/shared/interfaces/repository.interface';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IPageRepository } from '../../domain/repositories/page.repository.interface';
import { CreatePageDto } from '../dtos/create-page.dto';
import { UpdatePageDto } from '../dtos/update-page.dto';

@Injectable()
export class PagesService {
  constructor(
    @Inject(IPageRepository)
    private readonly pageRepository: IPageRepository,
  ) {}

  async create(createPageDto: CreatePageDto, userId?: string) {
    // Check slug uniqueness
    const existing = await this.pageRepository.findBySlug(createPageDto.slug);
    if (existing) {
      throw new ConflictException(MESSAGES.PAGE.SLUG_EXISTS);
    }

    return this.pageRepository.create({
      ...createPageDto,
      createdBy: userId,
    });
  }

  async findAll(options: PaginationOptions) {
    return this.pageRepository.findAll(options);
  }

  async findPublished(options: PaginationOptions) {
    return this.pageRepository.findPublished(options);
  }

  async findOne(id: string) {
    const page = await this.pageRepository.findById(id);
    if (!page) {
      throw new NotFoundException(MESSAGES.PAGE.NOT_FOUND);
    }
    return page;
  }

  async findBySlug(slug: string) {
    const page = await this.pageRepository.findBySlug(slug);
    if (!page) {
      throw new NotFoundException(MESSAGES.PAGE.NOT_FOUND);
    }
    return page;
  }

  async update(id: string, updatePageDto: UpdatePageDto, userId?: string) {
    await this.findOne(id); // Check exists

    // Check slug uniqueness if changed
    if (updatePageDto.slug) {
      const existing = await this.pageRepository.findBySlug(updatePageDto.slug);
      if (existing && existing.id !== id) {
        throw new ConflictException(MESSAGES.PAGE.SLUG_EXISTS);
      }
    }

    return this.pageRepository.update(id, {
      ...updatePageDto,
      updatedBy: userId,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check exists
    return this.pageRepository.delete(id);
  }

  async publish(id: string) {
    await this.findOne(id);
    return this.pageRepository.publish(id);
  }

  async unpublish(id: string) {
    await this.findOne(id);
    return this.pageRepository.unpublish(id);
  }
}
