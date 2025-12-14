import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SentryModule } from '@sentry/nestjs/setup';
import { join } from 'path';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import sentryConfig from './config/sentry.config';
import storageConfig from './config/storage.config';
import { AllExceptionsFilter } from './infrastructure/filters/all-exceptions.filter';
import { AuditInterceptor } from './infrastructure/interceptors/audit.interceptor';
import { SerializeInterceptor } from './infrastructure/interceptors/serialize.interceptor';
import { TransformInterceptor } from './infrastructure/interceptors/transform.interceptor';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './modules/auth.module';
import { CartModule } from './modules/cart.module';
import { CategoriesModule } from './modules/categories.module';
import { DashboardModule } from './modules/dashboard.module';
import { MediaModule } from './modules/media.module';
import { OrdersModule } from './modules/orders.module';
import { PaymentModule } from './modules/payment.module';
import { ProductsModule } from './modules/products.module';
import { UsersModule } from './modules/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        authConfig,
        storageConfig,
        sentryConfig,
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    SentryModule.forRoot(),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    UsersModule,
    DashboardModule,
    MediaModule,
    CartModule,
    PaymentModule,
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
