import { Category } from './category.entity';

export class Product {
  id!: string;
  name!: string;
  description!: string;
  price!: number;
  stock!: number;
  images!: string[];
  categoryId!: string;
  category?: Category;
  createdAt!: Date;
  updatedAt!: Date;
}
