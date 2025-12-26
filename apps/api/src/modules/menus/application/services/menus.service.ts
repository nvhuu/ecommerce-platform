import { MESSAGES } from '@/shared/constants/messages.constant';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IMenuItemRepository,
  IMenuRepository,
} from '../../domain/repositories/menu.repository.interface';
import { CreateMenuItemDto } from '../dtos/create-menu-item.dto';
import { CreateMenuDto } from '../dtos/create-menu.dto';
import { UpdateMenuItemDto } from '../dtos/update-menu-item.dto';
import { UpdateMenuDto } from '../dtos/update-menu.dto';

@Injectable()
export class MenusService {
  constructor(
    @Inject(IMenuRepository)
    private readonly menuRepository: IMenuRepository,
    @Inject(IMenuItemRepository)
    private readonly menuItemRepository: IMenuItemRepository,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    // Check if menu for this location already exists
    const existing = await this.menuRepository.findByLocation(
      createMenuDto.location,
    );
    if (existing) {
      throw new ConflictException(MESSAGES.MENU.LOCATION_EXISTS);
    }

    return this.menuRepository.create(createMenuDto);
  }

  async findAll() {
    return this.menuRepository.findAll();
  }

  async findOne(id: string) {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new NotFoundException(MESSAGES.MENU.NOT_FOUND);
    }
    return menu;
  }

  async findByLocation(location: string) {
    const menu = await this.menuRepository.findByLocation(location);
    if (!menu) {
      throw new NotFoundException(MESSAGES.MENU.NOT_FOUND);
    }
    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    await this.findOne(id); // Check exists

    // Check location uniqueness if changed
    if (updateMenuDto.location) {
      const existing = await this.menuRepository.findByLocation(
        updateMenuDto.location,
      );
      if (existing && existing.id !== id) {
        throw new ConflictException(MESSAGES.MENU.LOCATION_EXISTS);
      }
    }

    return this.menuRepository.update(id, updateMenuDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.menuRepository.delete(id);
  }

  // Menu Items
  async createMenuItem(menuId: string, createMenuItemDto: CreateMenuItemDto) {
    await this.findOne(menuId); // Ensure menu exists

    // If parentId provided, ensure parent exists
    if (createMenuItemDto.parentId) {
      const parent = await this.menuItemRepository.findById(
        createMenuItemDto.parentId,
      );
      if (!parent) {
        throw new NotFoundException(MESSAGES.MENU_ITEM.NOT_FOUND);
      }
    }

    return this.menuItemRepository.create({
      ...createMenuItemDto,
      menu: { connect: { id: menuId } },
      ...(createMenuItemDto.parentId && {
        parent: { connect: { id: createMenuItemDto.parentId } },
      }),
    });
  }

  async updateMenuItem(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    const menuItem = await this.menuItemRepository.findById(id);
    if (!menuItem) {
      throw new NotFoundException(MESSAGES.MENU_ITEM.NOT_FOUND);
    }

    // Validate parentId if provided
    if (updateMenuItemDto.parentId) {
      const parent = await this.menuItemRepository.findById(
        updateMenuItemDto.parentId,
      );
      if (!parent) {
        throw new NotFoundException(MESSAGES.MENU_ITEM.NOT_FOUND);
      }
      // Prevent circular reference
      if (updateMenuItemDto.parentId === id) {
        throw new ConflictException('Cannot set item as its own parent');
      }
    }

    return this.menuItemRepository.update(id, {
      ...updateMenuItemDto,
      ...(updateMenuItemDto.parentId && {
        parent: { connect: { id: updateMenuItemDto.parentId } },
      }),
    });
  }

  async removeMenuItem(id: string) {
    const menuItem = await this.menuItemRepository.findById(id);
    if (!menuItem) {
      throw new NotFoundException(MESSAGES.MENU_ITEM.NOT_FOUND);
    }
    return this.menuItemRepository.delete(id);
  }

  async reorderMenuItems(items: Array<{ id: string; order: number }>) {
    return this.menuItemRepository.reorderItems(items);
  }
}
