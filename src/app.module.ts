import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { HttpValidationPipe } from './common/pipes';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import {
  envValidator,
  mailConfig,
  authConfig,
  databaseConfig,
  othersConfig,
  serverConfig,
} from './common/config';
import { ReferralModule } from './modules/referral/referral.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { AddressBookModule } from './modules/address-book/address-book.module';
import { RequestPaymentModule } from './modules/request-payment/request-payment.module';
import { GiftModule } from './modules/gift/gift.module';
import { GroupPaymentModule } from './modules/group-payment/group-payment.module';
import { AnalyticsModule, AnalyticsMiddleware } from './modules/analytics';
import { WalletAuthModule } from './modules/wallet-auth/wallet-auth.module';
import { ApiKeyGuard } from './modules/auth/ApikeyGuard';
import { AppConfigServiceModule } from './common/config/services/config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : '.env',
      validationSchema: envValidator,
      load: [
        databaseConfig,
        mailConfig,
        authConfig,
        othersConfig,
        serverConfig,
      ],
      isGlobal: true,
    }),
    AppConfigServiceModule,
    ScheduleModule.forRoot(),
    HealthModule,
    DatabaseModule,
    // AuthModule,
    // ReferralModule,
    TransactionsModule,
    AddressBookModule,
    RequestPaymentModule,
    GiftModule,
    GroupPaymentModule,
    AnalyticsModule,
    WalletAuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    {
      provide: APP_PIPE,
      useClass: HttpValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AnalyticsMiddleware).forRoutes('*'); // Apply to all routes
  }
}
