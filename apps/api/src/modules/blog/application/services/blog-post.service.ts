import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IBlogPostRepository } from '../../domain/repositories/blog-post.repository.interface';
import { BlogPostQueryDto } from '../dtos/blog-post-query.dto';
import { CreateBlogPostDto, UpdateBlogPostDto } from '../dtos/blog-post.dto';

@Injectable()
export class BlogPostService {
  constructor(
    @Inject('IBlogPostRepository')
    private readonly postRepository: IBlogPostRepository,
  ) {}

  async create(authorId: string, dto: CreateBlogPostDto) {
    const existing = await this.postRepository.findBySlug(dto.slug);
    if (existing) {
      throw new BadRequestException('Slug already exists');
    }

    return this.postRepository.create({
      ...dto,
      authorId,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
    });
  }

  async findAll(query: BlogPostQueryDto) {
    return this.postRepository.findAll(query);
  }

  async findOne(id: string) {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }
    return post;
  }

  async findBySlug(slug: string) {
    const post = await this.postRepository.findBySlug(slug);
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    // Increment view count
    await this.postRepository.incrementViewCount(post.id);

    return post;
  }

  async update(id: string, dto: UpdateBlogPostDto) {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    if (dto.slug && dto.slug !== post.slug) {
      const existing = await this.postRepository.findBySlug(dto.slug);
      if (existing) {
        throw new BadRequestException('Slug already exists');
      }
    }

    return this.postRepository.update(id, {
      ...dto,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
    });
  }

  async remove(id: string) {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }
    return this.postRepository.delete(id);
  }
}
