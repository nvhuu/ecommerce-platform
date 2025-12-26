import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
import { Role } from '@/modules/users/domain/entities/user.entity';
import { MESSAGES } from '@/shared/constants/messages.constant';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMenuItemDto } from '../../application/dtos/create-menu-item.dto';
import { CreateMenuDto } from '../../application/dtos/create-menu.dto';
import { MenuResponseDto } from '../../application/dtos/menu-response.dto';
import { UpdateMenuItemDto } from '../../application/dtos/update-menu-item.dto';
import { UpdateMenuDto } from '../../application/dtos/update-menu.dto';
import { MenusService } from '../../application/services/menus.service';

@ApiTags('Menus')
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  // Menu Management
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.MENU.CREATED })
  @Serialize(MenuResponseDto)
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: MESSAGES.MENU.LIST_RETRIEVED })
  @Serialize(MenuResponseDto)
  findAll() {
    return this.menusService.findAll();
  }

  @Get('location/:location')
  @ApiOperation({ summary: MESSAGES.MENU.RETRIEVED })
  @Serialize(MenuResponseDto)
  findByLocation(@Param('location') location: string) {
    return this.menusService.findByLocation(location);
  }

  @Get(':id')
  @ApiOperation({ summary: MESSAGES.MENU.RETRIEVED })
  @Serialize(MenuResponseDto)
  findOne(@Param('id') id: string) {
    return this.menusService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update menu (Admin only)' })
  @Serialize(MenuResponseDto)
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete menu (Admin only)' })
  remove(@Param('id') id: string) {
    return this.menusService.remove(id);
  }

  // Menu Item Management
  @Post(':menuId/items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.MENU_ITEM.CREATED })
  createMenuItem(
    @Param('menuId') menuId: string,
    @Body() createMenuItemDto: CreateMenuItemDto,
  ) {
    return this.menusService.createMenuItem(menuId, createMenuItemDto);
  }

  @Patch('items/:itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.MENU_ITEM.UPDATED })
  updateMenuItem(
    @Param('itemId') itemId: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menusService.updateMenuItem(itemId, updateMenuItemDto);
  }

  @Delete('items/:itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.MENU_ITEM.DELETED })
  removeMenuItem(@Param('itemId') itemId: string) {
    return this.menusService.removeMenuItem(itemId);
  }

  @Put(':menuId/items/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.MENU_ITEM.REORDERED })
  reorderMenuItems(
    @Param('menuId') menuId: string,
    @Body() items: Array<{ id: string; order: number }>,
  ) {
    return this.menusService.reorderMenuItems(items);
  }
}
