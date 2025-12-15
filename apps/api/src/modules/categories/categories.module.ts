import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { CategoriesService } from './application/services/categories.service';
import { CategoryRepository } from './infrastructure/repositories/category.repository';
import { CategoriesController } from './presentation/controllers/categories.controller';

import { UsersModule } from '../users/users.module';

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
