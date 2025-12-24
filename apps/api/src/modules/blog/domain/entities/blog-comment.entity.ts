import { BaseEntity } from '@/shared/domain/base.entity';
import { Expose, Type } from 'class-transformer';
import { User } from '../../../users/domain/entities/user.entity';
import { BlogPost } from './blog-post.entity';

export class BlogComment extends BaseEntity {
  @Expose()
  content!: string;

  @Expose()
  isApproved!: boolean;

  @Expose()
  postId!: string;

  @Expose()
  @Type(() => BlogPost)
  post?: BlogPost;

  @Expose()
  userId?: string;

  @Expose()
  @Type(() => User)
  user?: User;

  @Expose()
  guestName?: string;

  @Expose()
  guestEmail?: string;

  @Expose()
  parentId?: string;

  @Expose()
  @Type(() => BlogComment)
  parent?: BlogComment;

  @Expose()
  @Type(() => BlogComment)
  replies?: BlogComment[];

  static toDomain(input: unknown): BlogComment | null {
    if (!input || typeof input !== 'object') return null;
    const data = input as Record<string, unknown>;
    const comment = new BlogComment();

    comment.id = data.id as string;
    comment.content = data.content as string;
    comment.isApproved = Boolean(data.isApproved);
    comment.postId = data.postId as string;
    comment.userId = data.userId as string | undefined;
    comment.guestName = data.guestName as string | undefined;
    comment.guestEmail = data.guestEmail as string | undefined;
    comment.parentId = data.parentId as string | undefined;

    if (data.post && typeof data.post === 'object') {
      const post = BlogPost.toDomain(data.post);
      if (post) comment.post = post;
    }

    if (data.user && typeof data.user === 'object') {
      const user = User.toDomain(data.user);
      if (user) comment.user = user;
    }

    if (data.replies && Array.isArray(data.replies)) {
      comment.replies = data.replies
        .map((r) => BlogComment.toDomain(r))
        .filter((r): r is BlogComment => r !== null);
    }

    comment.createdAt = data.createdAt as Date;
    comment.updatedAt = data.updatedAt as Date;

    return comment;
  }
}
