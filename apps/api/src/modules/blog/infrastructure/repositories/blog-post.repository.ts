import { PrismaService } from '@/core/prisma/prisma.service';
import { PaginatedResult } from '@/shared/interfaces/repository.interface';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  BlogPost,
  BlogPostStatus,
} from '../../domain/entities/blog-post.entity';
import {
  BlogFilterOptions,
  IBlogPostRepository,
} from '../../domain/repositories/blog-post.repository.interface';

@Injectable()
export class BlogPostRepository implements IBlogPostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(post: Partial<BlogPost>): Promise<BlogPost> {
    const created = await this.prisma.blogPost.create({
      data: {
        title: post.title!,
        slug: post.slug!,
        excerpt: post.excerpt,
        content: post.content!,
        coverImage: post.coverImage,
        status: (post.status as BlogPostStatus) || BlogPostStatus.DRAFT,
        seoKeywords: post.seoKeywords || [],
        authorId: post.authorId!,
        categoryId: post.categoryId!,
      } as Prisma.BlogPostUncheckedCreateInput,
      include: { author: true, category: true },
    });
    const result = BlogPost.toDomain(created);
    if (!result) throw new Error('Failed to create blog post');
    return result;
  }

  async findAll(
    options: BlogFilterOptions,
  ): Promise<PaginatedResult<BlogPost>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.BlogPostWhereInput = {
      ...(options.search
        ? {
            OR: [
              { title: { contains: options.search, mode: 'insensitive' } },
              { content: { contains: options.search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(options.categoryId ? { categoryId: options.categoryId } : {}),
      ...(options.status ? { status: options.status } : {}),
      ...(options.authorId ? { authorId: options.authorId } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { author: true, category: true },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return {
      data: data
        .map((item) => BlogPost.toDomain(item))
        .filter((item): item is BlogPost => item !== null),
      page,
      limit,
      total,
    };
  }

  async findById(id: string): Promise<BlogPost | null> {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: { author: true, category: true },
    });
    return post ? BlogPost.toDomain(post) : null;
  }

  async findBySlug(slug: string): Promise<BlogPost | null> {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: { author: true, category: true },
    });
    return post ? BlogPost.toDomain(post) : null;
  }

  async update(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
    const updated = await this.prisma.blogPost.update({
      where: { id },
      data: {
        ...(post.title && { title: post.title }),
        ...(post.slug && { slug: post.slug }),
        ...(post.excerpt !== undefined && { excerpt: post.excerpt }),
        ...(post.content && { content: post.content }),
        ...(post.coverImage !== undefined && { coverImage: post.coverImage }),
        ...(post.status && { status: post.status }),
        ...(post.publishedAt !== undefined && {
          publishedAt: post.publishedAt,
        }),
        ...(post.seoTitle !== undefined && { seoTitle: post.seoTitle }),
        ...(post.seoDescription !== undefined && {
          seoDescription: post.seoDescription,
        }),
        ...(post.seoKeywords !== undefined && {
          seoKeywords: post.seoKeywords,
        }),
        ...(post.categoryId && { categoryId: post.categoryId }),
      },
      include: { author: true, category: true },
    });
    const result = BlogPost.toDomain(updated);
    if (!result) throw new Error('Failed to update blog post');
    return result;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.blogPost.delete({
      where: { id },
    });
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.prisma.blogPost.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }
}
