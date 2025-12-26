import { Menu, MenuItem, Prisma } from '@prisma/client';

export interface IMenuRepository {
  create(data: Prisma.MenuCreateInput): Promise<Menu>;
  findAll(): Promise<Menu[]>;
  findById(id: string): Promise<Menu | null>;
  findByIdWithItems(id: string): Promise<Menu | null>;
  findByLocation(location: string): Promise<Menu | null>;
  update(id: string, data: Prisma.MenuUpdateInput): Promise<Menu>;
  delete(id: string): Promise<Menu>;
}

export const IMenuRepository = Symbol('IMenuRepository');

export interface IMenuItemRepository {
  create(data: Prisma.MenuItemCreateInput): Promise<MenuItem>;
  findById(id: string): Promise<MenuItem | null>;
  findByMenuId(menuId: string): Promise<MenuItem[]>;
  update(id: string, data: Prisma.MenuItemUpdateInput): Promise<MenuItem>;
  delete(id: string): Promise<MenuItem>;
  reorderItems(items: Array<{ id: string; order: number }>): Promise<void>;
}

export const IMenuItemRepository = Symbol('IMenuItemRepository');
