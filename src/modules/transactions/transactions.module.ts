import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './transaction.entity';
import { TransactionRepository } from './transaction.repository';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  providers: [TransactionRepository, TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService, TransactionRepository],
})
export class TransactionsModule {}
