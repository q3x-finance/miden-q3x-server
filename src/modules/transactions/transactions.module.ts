import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './transaction.entity';
import { TransactionRepository } from './transaction.repository';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { GiftModule } from '../gift/gift.module';
import { WalletAuthModule } from '../wallet-auth/wallet-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    GiftModule,
    WalletAuthModule,
  ],
  providers: [TransactionRepository, TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService, TransactionRepository],
})
export class TransactionsModule {}
