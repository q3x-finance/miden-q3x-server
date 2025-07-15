import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  WalletAuthKeyEntity,
  WalletAuthSessionEntity,
  WalletAuthChallengeEntity,
} from './wallet-auth.entity';
import { WalletAuthService } from './wallet-auth.service';
import { WalletAuthController } from './wallet-auth.controller';
import { WalletAuthGuard } from './wallet-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WalletAuthKeyEntity,
      WalletAuthSessionEntity,
      WalletAuthChallengeEntity,
    ]),
  ],
  providers: [WalletAuthService, WalletAuthGuard],
  controllers: [WalletAuthController],
  exports: [WalletAuthService, WalletAuthGuard],
})
export class WalletAuthModule {}
