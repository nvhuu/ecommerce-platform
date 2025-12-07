export class CreateProductDto {
  name!: string;
  description!: string;
  price!: number;
  stock!: number;
  images!: string[];
  categoryId!: string;
}

export class UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  images?: string[];
  categoryId?: string;
}
