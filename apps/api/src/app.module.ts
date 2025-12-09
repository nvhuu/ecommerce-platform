import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { SentryModule } from '@sentry/nestjs/setup';
import { AuthModule } from './application/modules/auth/auth.module';
import { CategoriesModule } from './application/modules/categories/categories.module';
import { DashboardModule } from './application/modules/dashboard/dashboard.module';
import { OrdersModule } from './application/modules/orders/orders.module';
import { ProductsModule } from './application/modules/products/products.module';
import { UsersModule } from './application/modules/users/users.module';
import { AllExceptionsFilter } from './infrastructure/filters/all-exceptions.filter';
import { AuditInterceptor } from './infrastructure/interceptors/audit.interceptor';
import { SerializeInterceptor } from './infrastructure/interceptors/serialize.interceptor';
import { TransformInterceptor } from './infrastructure/interceptors/transform.interceptor';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SentryModule.forRoot(),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    UsersModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SerializeInterceptor,
    },
  ],
})
export class AppModule {}
