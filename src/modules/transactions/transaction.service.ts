import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { TransactionEntity, TransactionStatus } from './transaction.entity';
import { SendTransactionDto } from './transaction.dto';
import { ErrorTransaction } from 'src/common/enums/errors';
import { handleError } from 'src/common/utils/errors';
import { In } from 'typeorm';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(private readonly transactionRepository: TransactionRepository) {}

  // *************************************************
  // **************** GET METHODS ********************
  // *************************************************

  async getConsumableTransactions(userId: string): Promise<any[]> {
    try {
      // fetch all private, non-recallable, and pending transactions sent to this user
      const txs = await this.transactionRepository.find({
        recipient: userId,
        status: TransactionStatus.PENDING,
        private: true,
        recallable: false,
      });
      return txs;
    } catch (error) {
      handleError(error, this.logger);
    }
  }

  async getRecallDashboardData(userAddress: string) {
    try {
      // Fetch all recallable transactions sent by this user
      const allRecallable = await this.transactionRepository.find({
        sender: userAddress,
        recallable: true,
      });

      // Split into recallable (pending recall) and waitingToRecall
      const now = new Date();
      const recallable = allRecallable.filter(
        (tx) =>
          (!tx.recallableTime || tx.recallableTime <= now) &&
          tx.status === TransactionStatus.PENDING,
      );
      const waitingToRecall = allRecallable.filter(
        (tx) =>
          tx.recallableTime &&
          tx.recallableTime > now &&
          tx.status === TransactionStatus.PENDING,
      );

      // Find the next recall time (minimum recallableTime in waitingToRecall)
      let nextRecallTime: Date | null = null;
      if (waitingToRecall.length > 0) {
        nextRecallTime = waitingToRecall.reduce(
          (min, tx) =>
            !min || (tx.recallableTime && tx.recallableTime < min)
              ? tx.recallableTime
              : min,
          null as Date | null,
        );
      }

      // Count all recalled transactions for this user
      const recalledTxs = await this.transactionRepository.find({
        sender: userAddress,
        status: TransactionStatus.RECALLED,
      });
      const recalledCount = recalledTxs.length;

      return {
        recallable,
        waitingToRecall,
        nextRecallTime,
        recalledCount,
      };
    } catch (error) {
      handleError(error, this.logger);
    }
  }

  // *************************************************
  // **************** POST METHODS *******************
  // *************************************************

  async sendSingle(dto: SendTransactionDto): Promise<TransactionEntity | null> {
    try {
      const entityData = await this.validateTransaction(dto);
      if (!entityData) return null;
      return await this.transactionRepository.create(entityData);
    } catch (error) {
      handleError(error, this.logger);
    }
  }

  async sendBatch(dtos: SendTransactionDto[]): Promise<TransactionEntity[]> {
    try {
      const entities: Partial<TransactionEntity>[] = [];

      for (const dto of dtos) {
        const entityData = await this.validateTransaction(dto);
        if (entityData) {
          entities.push(entityData);
        }
      }

      if (entities.length === 0) {
        return [];
      }

      return this.transactionRepository.createMany(entities);
    } catch (error) {
      handleError(error, this.logger);
    }
  }

  // *************************************************
  // **************** PUT METHODS *******************
  // *************************************************

  async recallTransactions(
    transactionIds: string[],
  ): Promise<{ affected: number }> {
    const ids = this.parseAndValidateTransactionIds(transactionIds);
    // first check if transaction is available
    const transactions = await this.transactionRepository.find({
      id: In(ids),
      status: TransactionStatus.PENDING,
    });
    if (transactions.length !== ids.length) {
      throw new BadRequestException(ErrorTransaction.TransactionNotFound);
    }

    const affected = await this.transactionRepository.updateMany(
      { id: In(ids), status: TransactionStatus.PENDING },
      { status: TransactionStatus.RECALLED },
    );
    return { affected: affected || 0 };
  }

  async consumeTransactions(
    transactionIds: string[],
  ): Promise<{ affected: number }> {
    const ids = this.parseAndValidateTransactionIds(transactionIds);
    // first check if transaction is available
    const transactions = await this.transactionRepository.find({
      id: In(ids),
      status: TransactionStatus.PENDING,
    });
    if (transactions.length !== ids.length) {
      throw new BadRequestException(ErrorTransaction.TransactionNotFound);
    }

    const affected = await this.transactionRepository.updateMany(
      { id: In(ids), status: TransactionStatus.PENDING },
      { status: TransactionStatus.CONSUMED },
    );
    return { affected: affected || 0 };
  }

  // *************************************************
  // **************** UTILS METHODS ******************
  // *************************************************

  private async validateTransaction(
    dto: SendTransactionDto,
  ): Promise<Partial<TransactionEntity> | null> {
    const { AccountId } = await import('@demox-labs/miden-sdk');

    // we dont store public transactions
    if (!dto.private && !dto.recallable) {
      return null;
    }

    // validate if sender and recipient are valid
    const sender = AccountId.fromHex(dto.sender);
    const recipient = AccountId.fromHex(dto.recipient);

    if (!sender.isRegularAccount() || !recipient.isRegularAccount()) {
      throw new BadRequestException(ErrorTransaction.InvalidSenderOrRecipient);
    }

    // if recallable flag is true, we need to check if recallable time is valid
    if (dto.recallable) {
      if (!dto.recallableTime || dto.recallableTime < new Date()) {
        throw new BadRequestException(ErrorTransaction.InvalidRecallableTime);
      }
    }

    // the assets length should be at least 1
    if (dto.assets.length < 1) {
      throw new BadRequestException(ErrorTransaction.InvalidAssetsLength);
    }

    // the assets should contain correct faucet and amount
    for (const asset of dto.assets) {
      if (!asset.faucetId || !asset.amount) {
        throw new BadRequestException(ErrorTransaction.InvalidAssets);
      }
      if (Number(asset.amount) <= 0) {
        throw new BadRequestException(ErrorTransaction.InvalidAssets);
      }
      AccountId.fromHex(asset.faucetId);
    }

    // verify the serial number is number and array length is 4
    if (dto.serialNumber.length !== 4) {
      throw new BadRequestException(ErrorTransaction.InvalidSerialNumber);
    }
    for (const serialNumber of dto.serialNumber) {
      if (typeof serialNumber !== 'number') {
        throw new BadRequestException(ErrorTransaction.InvalidSerialNumber);
      }
    }

    return {
      sender: dto.sender,
      recipient: dto.recipient,
      assets: dto.assets,
      private: dto.private,
      recallable: dto.recallable,
      recallableTime: dto.recallableTime ? new Date(dto.recallableTime) : null,
      serialNumber: dto.serialNumber,
      noteType: dto.noteType,
      status: TransactionStatus.PENDING,
    };
  }

  private parseAndValidateTransactionIds(transactionIds: string[]): number[] {
    return transactionIds.map((id) => {
      const parsedId = Number(id);
      if (isNaN(parsedId)) {
        throw new BadRequestException(ErrorTransaction.InvalidTransactionId);
      }
      return parsedId;
    });
  }
}
