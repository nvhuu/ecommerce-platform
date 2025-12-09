import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../infrastructure/prisma/prisma.module';
import { CategoryRepository } from '../../../infrastructure/repositories/category.repository';
import { CategoriesController } from '../../../presentation/controllers/categories.controller';
import { CategoriesService } from './categories.service';

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
