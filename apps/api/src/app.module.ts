import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { SentryModule } from '@sentry/nestjs/setup';
import { join } from 'path';
import appConfig from './core/config/app.config';
import authConfig from './core/config/auth.config';
import databaseConfig from './core/config/database.config';
import sentryConfig from './core/config/sentry.config';
import storageConfig from './core/config/storage.config';
import { AllExceptionsFilter } from './core/filters/all-exceptions.filter';
import { AuditInterceptor } from './core/interceptors/audit.interceptor';
import { SerializeInterceptor } from './core/interceptors/serialize.interceptor';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { CartModule } from './modules/cart/cart.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CouponModule } from './modules/coupons/coupon.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { EmailModule } from './modules/email/email.module';
import { FormsModule } from './modules/forms/forms.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { MarketingModule } from './modules/marketing/marketing.module';
import { MediaModule } from './modules/media/media.module';
import { MenusModule } from './modules/menus/menus.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PagesModule } from './modules/pages/pages.module';
import { PaymentModule } from './modules/payments/payment.module'; // Updated path to plural 'payments'
import { ProductsModule } from './modules/products/products.module';
import { ReturnModule } from './modules/returns/return.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { SecurityModule } from './modules/security/security.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ShipmentModule } from './modules/shipments/shipment.module';
import { ShippingAddressModule } from './modules/users/address/shipping-address.module';
import { UsersModule } from './modules/users/users.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';

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
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests per TTL (generous default for admin)
      },
    ]),
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
    ReviewsModule,
    InventoryModule,
    PaymentModule,
    ShipmentModule,
    CouponModule,
    ReturnModule,
    NotificationModule,
    ShippingAddressModule,
    BlogModule,
    PagesModule,
    MenusModule,
    SettingsModule,
    FormsModule,
    SecurityModule,
    WishlistModule,
    MarketingModule,
    EmailModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    } as const,
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
