import { Expose, Type } from 'class-transformer';

class ReviewUserDto {
  @Expose()
  id!: string;

  @Expose()
  email!: string;
}

class ReviewProductDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;
}

export class ReviewResponseDto {
  @Expose()
  id!: string;

  @Expose()
  rating!: number;

  @Expose()
  comment?: string;

  @Expose()
  userId!: string;

  @Expose()
  @Type(() => ReviewUserDto)
  user?: ReviewUserDto;

  @Expose()
  productId!: string;

  @Expose()
  @Type(() => ReviewProductDto)
  product?: ReviewProductDto;

  @Expose()
  createdAt!: Date;
}
