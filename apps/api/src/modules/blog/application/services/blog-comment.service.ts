import { PaginationQueryDto } from '@/shared/dtos/query/pagination-query.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBlogCommentRepository } from '../../domain/repositories/blog-comment.repository.interface';
import {
  CreateBlogCommentDto,
  UpdateBlogCommentDto,
} from '../dtos/blog-comment.dto';

@Injectable()
export class BlogCommentService {
  constructor(
    @Inject('IBlogCommentRepository')
    private readonly commentRepository: IBlogCommentRepository,
  ) {}

  async create(userId: string | undefined, dto: CreateBlogCommentDto) {
    if (dto.parentId) {
      const parent = await this.commentRepository.findById(dto.parentId);
      if (!parent) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    return this.commentRepository.create({
      ...dto,
      userId,
    });
  }

  async findAll(postId: string, query: PaginationQueryDto) {
    return this.commentRepository.findAll({
      ...query,
      postId,
      isApproved: true,
    }); // Public view usually only approved
  }

  async findAllAdmin(query: PaginationQueryDto) {
    return this.commentRepository.findAll(query);
  }

  async findOne(id: string) {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException('Blog comment not found');
    }
    return comment;
  }

  async update(id: string, dto: UpdateBlogCommentDto) {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException('Blog comment not found');
    }

    return this.commentRepository.update(id, dto);
  }

  async remove(id: string) {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException('Blog comment not found');
    }
    return this.commentRepository.delete(id);
  }
}
