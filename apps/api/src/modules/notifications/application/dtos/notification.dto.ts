import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  message!: string;

  @ApiProperty({ required: false })
  data?: any;

  @ApiProperty()
  isRead!: boolean;

  @ApiProperty()
  createdAt!: Date;
}

export class NotificationListResponseDto {
  @ApiProperty({ type: [NotificationResponseDto] })
  data!: NotificationResponseDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  unreadCount!: number;
}
