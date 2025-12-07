import { Expose, Type } from 'class-transformer';
import { CategoryResponseDto } from './category.response.dto';

export class ProductResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  price!: number;

  @Expose()
  stock!: number;

  @Expose()
  images!: string[];

  @Expose()
  categoryId!: string;

  @Expose()
  @Type(() => CategoryResponseDto)
  category?: CategoryResponseDto;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
