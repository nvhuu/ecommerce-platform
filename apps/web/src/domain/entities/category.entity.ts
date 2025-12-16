// Category domain entity

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
  parent?: Category;
  children?: Category[];
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}
