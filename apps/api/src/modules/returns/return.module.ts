import { PrismaModule } from '@/core/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ReturnService } from './application/services/return.service';
import { ReturnRepository } from './infrastructure/repositories/return.repository';
import { ReturnController } from './presentation/controllers/return.controller';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [ReturnController],
  providers: [
    ReturnService,
    {
      provide: 'IReturnRepository',
      useClass: ReturnRepository,
    },
  ],
  exports: [ReturnService],
})
export class ReturnModule {}
