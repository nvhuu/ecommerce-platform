export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}
