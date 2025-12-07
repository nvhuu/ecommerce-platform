import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { SentryModule } from '@sentry/nestjs/setup';
import { AuthModule } from './application/modules/auth/auth.module';
import { CategoriesModule } from './application/modules/categories/categories.module';
import { OrdersModule } from './application/modules/orders/orders.module';
import { ProductsModule } from './application/modules/products/products.module';
import { AllExceptionsFilter } from './infrastructure/filters/all-exceptions.filter';
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
  ],
})
export class AppModule {}
