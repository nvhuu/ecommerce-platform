import { UserResponseDto } from '@/modules/users/application/dtos/response/user.response.dto';
import { Expose, Type } from 'class-transformer';

export class BlogCommentResponseDto {
  @Expose()
  id!: string;

  @Expose()
  content!: string;

  @Expose()
  isApproved!: boolean;

  @Expose()
  postId!: string;

  @Expose()
  userId?: string;

  @Expose()
  @Type(() => UserResponseDto)
  user?: UserResponseDto;

  @Expose()
  guestName?: string;

  @Expose()
  parentId?: string;

  @Expose()
  createdAt!: Date;
}
