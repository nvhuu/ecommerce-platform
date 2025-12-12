import { Module } from '@nestjs/common';
import { CategoriesService } from '../application/services/categories.service';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';
import { CategoryRepository } from '../infrastructure/repositories/category.repository';
import { CategoriesController } from '../presentation/controllers/categories.controller';

import { UsersModule } from './users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: 'ICategoryRepository',
      useClass: CategoryRepository,
    },
  ],
})
export class CategoriesModule {}
