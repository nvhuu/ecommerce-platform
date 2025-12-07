export class CreateCategoryDto {
  name!: string;
  slug!: string;
  parentId?: string;
}

export class UpdateCategoryDto {
  name?: string;
  slug?: string;
  parentId?: string;
}
