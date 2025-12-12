import { Module } from '@nestjs/common';
import { UsersService } from '../application/services/users.service';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { UsersController } from '../presentation/controllers/users.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: ['IUserRepository', UsersService],
})
export class UsersModule {}
