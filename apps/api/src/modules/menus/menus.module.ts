import { UsersModule } from '@/modules/users/users.module';
import { Module } from '@nestjs/common';
import { MenusService } from './application/services/menus.service';
import {
  IMenuItemRepository,
  IMenuRepository,
} from './domain/repositories/menu.repository.interface';
import { MenuItemRepository } from './infrastructure/repositories/menu-item.repository';
import { MenuRepository } from './infrastructure/repositories/menu.repository';
import { MenusController } from './presentation/controllers/menus.controller';

@Module({
  imports: [UsersModule],
  controllers: [MenusController],
  providers: [
    MenusService,
    {
      provide: IMenuRepository,
      useClass: MenuRepository,
    },
    {
      provide: IMenuItemRepository,
      useClass: MenuItemRepository,
    },
  ],
  exports: [MenusService],
})
export class MenusModule {}
