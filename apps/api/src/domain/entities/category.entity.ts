export class Category {
  id!: string;
  name!: string;
  slug!: string;
  parentId?: string | null;
  children?: Category[];
  parent?: Category;
  createdAt!: Date;
  updatedAt!: Date;
}
