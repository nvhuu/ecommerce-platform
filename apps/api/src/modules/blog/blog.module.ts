import { Module } from '@nestjs/common';
import { BlogCategoryService } from './application/services/blog-category.service';
import { BlogCommentService } from './application/services/blog-comment.service';
import { BlogPostService } from './application/services/blog-post.service';
import { BlogCategoryRepository } from './infrastructure/repositories/blog-category.repository';
import { BlogCommentRepository } from './infrastructure/repositories/blog-comment.repository';
import { BlogPostRepository } from './infrastructure/repositories/blog-post.repository';
import { BlogCategoryController } from './presentation/controllers/blog-category.controller';
import { BlogCommentController } from './presentation/controllers/blog-comment.controller';
import { BlogPostController } from './presentation/controllers/blog-post.controller';

@Module({
  controllers: [
    BlogCategoryController,
    BlogPostController,
    BlogCommentController,
  ],
  providers: [
    BlogCategoryService,
    {
      provide: 'IBlogCategoryRepository',
      useClass: BlogCategoryRepository,
    },
    BlogPostService,
    {
      provide: 'IBlogPostRepository',
      useClass: BlogPostRepository,
    },
    BlogCommentService,
    {
      provide: 'IBlogCommentRepository',
      useClass: BlogCommentRepository,
    },
  ],
  exports: [BlogCategoryService, BlogPostService, BlogCommentService],
})
export class BlogModule {}
