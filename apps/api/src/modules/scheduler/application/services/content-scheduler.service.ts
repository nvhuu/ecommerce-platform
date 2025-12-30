import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { BlogPostStatus, ContentType, PageStatus } from '@prisma/client';

@Injectable()
export class ContentSchedulerService {
  private readonly logger = new Logger(ContentSchedulerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async publish(contentType: ContentType, contentId: string): Promise<void> {
    this.logger.log(`Publishing ${contentType} ${contentId}`);

    try {
      switch (contentType) {
        case ContentType.PRODUCT:
          await this.prisma.product.update({
            where: { id: contentId },
            data: { isActive: true },
          });
          break;

        case ContentType.BLOG:
          await this.prisma.blogPost.update({
            where: { id: contentId },
            data: {
              status: BlogPostStatus.PUBLISHED,
              publishedAt: new Date(),
            },
          });
          break;

        case ContentType.PAGE:
          await this.prisma.page.update({
            where: { id: contentId },
            data: {
              status: PageStatus.PUBLISHED,
              publishedAt: new Date(),
            },
          });
          break;
      }
    } catch (error) {
      this.logger.error(`Failed to publish ${contentType} ${contentId}`, error);
      throw error;
    }
  }

  async unpublish(contentType: ContentType, contentId: string): Promise<void> {
    this.logger.log(`Unpublishing ${contentType} ${contentId}`);

    try {
      switch (contentType) {
        case ContentType.PRODUCT:
          await this.prisma.product.update({
            where: { id: contentId },
            data: { isActive: false },
          });
          break;

        case ContentType.BLOG:
          await this.prisma.blogPost.update({
            where: { id: contentId },
            data: { status: BlogPostStatus.DRAFT },
          });
          break;

        case ContentType.PAGE:
          await this.prisma.page.update({
            where: { id: contentId },
            data: { status: PageStatus.DRAFT },
          });
          break;
      }
    } catch (error) {
      this.logger.error(
        `Failed to unpublish ${contentType} ${contentId}`,
        error,
      );
      throw error;
    }
  }
}
