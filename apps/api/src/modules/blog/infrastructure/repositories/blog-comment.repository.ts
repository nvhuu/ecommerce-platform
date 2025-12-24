import { PrismaService } from '@/core/prisma/prisma.service';
import { PaginatedResult } from '@/shared/interfaces/repository.interface';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BlogComment } from '../../domain/entities/blog-comment.entity';
import {
  BlogCommentFilterOptions,
  IBlogCommentRepository,
} from '../../domain/repositories/blog-comment.repository.interface';

@Injectable()
export class BlogCommentRepository implements IBlogCommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(comment: Partial<BlogComment>): Promise<BlogComment> {
    const created = await this.prisma.blogComment.create({
      data: {
        content: comment.content!,
        postId: comment.postId!,
        userId: comment.userId,
        guestName: comment.guestName,
        guestEmail: comment.guestEmail,
        parentId: comment.parentId,
        isApproved: comment.isApproved ?? true,
      },
      include: { user: true, post: true },
    });
    const result = BlogComment.toDomain(created);
    if (!result) throw new Error('Failed to create blog comment');
    return result;
  }

  async findAll(
    options: BlogCommentFilterOptions,
  ): Promise<PaginatedResult<BlogComment>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.BlogCommentWhereInput = {
      ...(options.postId ? { postId: options.postId } : {}),
      ...(options.isApproved !== undefined
        ? { isApproved: options.isApproved }
        : {}),
      ...(options.search
        ? {
            content: { contains: options.search, mode: 'insensitive' },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.blogComment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // newest first
        include: { user: true },
      }),
      this.prisma.blogComment.count({ where }),
    ]);

    return {
      data: data
        .map((item) => BlogComment.toDomain(item))
        .filter((item): item is BlogComment => item !== null),
      page,
      limit,
      total,
    };
  }

  async findById(id: string): Promise<BlogComment | null> {
    const comment = await this.prisma.blogComment.findUnique({
      where: { id },
      include: { user: true, replies: { include: { user: true } } },
    });
    return comment ? BlogComment.toDomain(comment) : null;
  }

  async update(
    id: string,
    comment: Partial<BlogComment>,
  ): Promise<BlogComment> {
    const updated = await this.prisma.blogComment.update({
      where: { id },
      data: {
        ...(comment.content && { content: comment.content }),
        ...(comment.isApproved !== undefined && {
          isApproved: comment.isApproved,
        }),
      },
      include: { user: true },
    });
    const result = BlogComment.toDomain(updated);
    if (!result) throw new Error('Failed to update blog comment');
    return result;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.blogComment.delete({
      where: { id },
    });
  }

  async countByPostId(postId: string): Promise<number> {
    return this.prisma.blogComment.count({
      where: { postId, isApproved: true },
    });
  }
}
