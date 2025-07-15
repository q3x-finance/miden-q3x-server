import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { TransactionEntity } from './transaction.entity';
import { SendTransactionDto, RecallRequestDto } from './transaction.dto';
import { ErrorTransaction } from 'src/common/enums/errors';
import { handleError } from 'src/common/utils/errors';
import { In } from 'typeorm';
import { GiftService } from '../gift/gift.service';
import { NoteStatus } from 'src/common/enums/note';
import {
  validateAddress,
  validateAmount,
  validateSerialNumber,
  validateFutureDate,
  validateDifferentAddresses,
  normalizeAddress,
} from 'src/common/utils/validation.util';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly giftService: GiftService,
  ) {}

  // *************************************************
  // **************** GET METHODS ********************
  // *************************************************

  async getConsumableTransactions(userId: string): Promise<any[]> {
    try {
      validateAddress(userId, 'userId');
      const normalizedUserId = normalizeAddress(userId);

      // Fetch all private, non-recallable, and pending transactions sent to this user
      const txs = await this.transactionRepository.find({
        recipient: normalizedUserId,
        status: NoteStatus.PENDING,
        private: true,
      });
      return txs;
    } catch (error) {
      handleError(error, this.logger);
    }
  }

  async getRecallDashboardData(userAddress: string) {
    try {
      validateAddress(userAddress, 'userAddress');
      const normalizedUserAddress = normalizeAddress(userAddress);

      // Fetch all recallable transactions sent by this user
      const allRecallable = await this.transactionRepository.find({
        sender: normalizedUserAddress,
        recallable: true,
      });

      // Split into recallable (pending recall) and waitingToRecall
      const now = new Date();
      const recallable = allRecallable.filter(
        (tx) =>
          (!tx.recallableTime || tx.recallableTime <= now) &&
          tx.status === NoteStatus.PENDING,
      );
      const waitingToRecall = allRecallable.filter(
        (tx) =>
          tx.recallableTime &&
          tx.recallableTime > now &&
          tx.status === NoteStatus.PENDING,
      );

      // Fetch recallable and waiting gifts (red packets)
      const allGifts = await this.giftService.findRecallableGifts(
        normalizedUserAddress,
      );

      const recallableGifts = allGifts.filter(
        (gift) => gift.recallableTime && gift.recallableTime <= now,
      );
      const waitingGifts = allGifts.filter(
        (gift) => gift.recallableTime && gift.recallableTime > now,
      );

      // Map gifts to unified format
      const recallableGiftItems = recallableGifts.map((gift) => ({
        ...gift,
        isGift: true,
      }));
      const waitingGiftItems = waitingGifts.map((gift) => ({
        ...gift,
        isGift: true,
      }));

      // Map transactions to unified format
      const recallableTxItems = recallable.map((tx) => ({
        ...tx,
        isGift: false,
      }));
      const waitingTxItems = waitingToRecall.map((tx) => ({
        ...tx,
        isGift: false,
      }));

      // Merge
      const recallableItems = [...recallableTxItems, ...recallableGiftItems];
      const waitingToRecallItems = [...waitingTxItems, ...waitingGiftItems];

      // Find the next recall time (minimum recallableTime in waitingToRecall and recallableAfter in waitingGifts)
      let nextRecallTime: Date | null = null;
      const allWaitingTimes = [
        ...waitingToRecall.map((tx) => tx.recallableTime),
        ...waitingGifts.map((gift) => gift.recallableTime),
      ].filter(Boolean);
      if (allWaitingTimes.length > 0) {
        nextRecallTime = allWaitingTimes.reduce(
          (min, t) => (!min || (t && t < min) ? t : min),
          null as Date | null,
        );
      }

      // Count all recalled transactions for this user
      const recalledTxs = await this.transactionRepository.find({
        sender: normalizedUserAddress,
        status: NoteStatus.RECALLED,
      });

      const recalledGifts = await this.giftService.findRecalledGifts(
        normalizedUserAddress,
      );

      const recalledCount = recalledTxs.length + recalledGifts.length;

      return {
        recallableItems,
        waitingToRecallItems,
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
      if (!dtos || !Array.isArray(dtos) || dtos.length === 0) {
        throw new BadRequestException(
          'Transaction array is required and cannot be empty',
        );
      }

      if (dtos.length > 100) {
        throw new BadRequestException(
          'Maximum 100 transactions allowed per batch',
        );
      }

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
    try {
      const ids = this.parseAndValidateTransactionIds(transactionIds);

      // First check if transactions are available and in pending status
      const transactions = await this.transactionRepository.find({
        id: In(ids),
        status: NoteStatus.PENDING,
      });

      if (transactions.length !== ids.length) {
        throw new BadRequestException(ErrorTransaction.TransactionNotFound);
      }

      // Check if transactions are recallable
      const now = new Date();
      const nonRecallable = transactions.filter(
        (tx) =>
          !tx.recallable || (tx.recallableTime && tx.recallableTime > now),
      );

      if (nonRecallable.length > 0) {
        throw new BadRequestException(
          'Some transactions are not recallable yet',
        );
      }

      const affected = await this.transactionRepository.updateMany(
        { id: In(ids), status: NoteStatus.PENDING },
        { status: NoteStatus.RECALLED },
      );
      return { affected: affected || 0 };
    } catch (error) {
      handleError(error, this.logger);
    }
  }

  async consumeTransactions(
    transactionIds: string[],
  ): Promise<{ affected: number }> {
    try {
      const ids = this.parseAndValidateTransactionIds(transactionIds);

      // First check if transactions are available and in pending status
      const transactions = await this.transactionRepository.find({
        id: In(ids),
        status: NoteStatus.PENDING,
      });

      if (transactions.length !== ids.length) {
        throw new BadRequestException(ErrorTransaction.TransactionNotFound);
      }

      const affected = await this.transactionRepository.updateMany(
        { id: In(ids), status: NoteStatus.PENDING },
        { status: NoteStatus.CONSUMED },
      );
      return { affected: affected || 0 };
    } catch (error) {
      ``;
      handleError(error, this.logger);
    }
  }

  async recallBatch(dto: RecallRequestDto) {
    try {
      if (!dto.items || !Array.isArray(dto.items) || dto.items.length === 0) {
        throw new BadRequestException(
          'Items array is required and cannot be empty',
        );
      }

      const results = [];
      for (const item of dto.items) {
        if (item.type === 'transaction') {
          try {
            const affected = await this.recallTransactions([
              item.id.toString(),
            ]);
            results.push({
              type: 'transaction',
              id: item.id,
              success: !!affected.affected,
            });
          } catch (e) {
            results.push({
              type: 'transaction',
              id: item.id,
              success: false,
              error: e.message,
            });
          }
        } else if (item.type === 'gift') {
          try {
            await this.giftService.recallGift(item.id);
            results.push({ type: 'gift', id: item.id, success: true });
          } catch (e) {
            results.push({
              type: 'gift',
              id: item.id,
              success: false,
              error: e.message,
            });
          }
        }
      }
      return { results };
    } catch (error) {
      handleError(error, this.logger);
    }
  }

  // *************************************************
  // **************** UTILS METHODS ******************
  // *************************************************

  private async validateTransaction(
    dto: SendTransactionDto,
  ): Promise<Partial<TransactionEntity> | null> {
    try {
      // Validate addresses
      validateAddress(dto.sender, 'sender');
      validateAddress(dto.recipient, 'recipient');

      // Normalize addresses
      const normalizedSender = normalizeAddress(dto.sender);
      const normalizedRecipient = normalizeAddress(dto.recipient);

      // Check if sender and recipient are different
      validateDifferentAddresses(
        normalizedSender,
        normalizedRecipient,
        'sender',
        'recipient',
      );

      // We don't store public transactions that are not recallable
      if (!dto.private && !dto.recallable) {
        return null;
      }

      // Validate recallable time if recallable flag is true
      if (dto.recallable && dto.recallableTime) {
        validateFutureDate(dto.recallableTime, 'recallableTime');
      }

      // Validate assets
      if (!dto.assets || dto.assets.length < 1) {
        throw new BadRequestException(ErrorTransaction.InvalidAssetsLength);
      }

      // Validate each asset
      for (const asset of dto.assets) {
        if (!asset.faucetId || !asset.amount) {
          throw new BadRequestException(ErrorTransaction.InvalidAssets);
        }

        validateAddress(asset.faucetId, 'asset.faucetId');
        validateAmount(asset.amount, 'asset.amount');
      }

      // Validate serial number
      validateSerialNumber(dto.serialNumber, 'serialNumber');

      // Normalize asset faucetIds
      const normalizedAssets = dto.assets.map((asset) => ({
        faucetId: normalizeAddress(asset.faucetId),
        amount: asset.amount,
      }));

      return {
        sender: normalizedSender,
        recipient: normalizedRecipient,
        assets: normalizedAssets,
        private: dto.private,
        recallable: dto.recallable,
        recallableTime: dto.recallableTime
          ? new Date(dto.recallableTime)
          : null,
        serialNumber: dto.serialNumber,
        noteType: dto.noteType,
        status: NoteStatus.PENDING,
      };
    } catch (error) {
      handleError(error, this.logger);
    }
  }

  private parseAndValidateTransactionIds(transactionIds: string[]): number[] {
    if (
      !transactionIds ||
      !Array.isArray(transactionIds) ||
      transactionIds.length === 0
    ) {
      throw new BadRequestException(
        'Transaction IDs array is required and cannot be empty',
      );
    }

    if (transactionIds.length > 100) {
      throw new BadRequestException('Maximum 100 transaction IDs allowed');
    }

    return transactionIds.map((id) => {
      const parsedId = Number(id);
      if (isNaN(parsedId) || parsedId <= 0) {
        throw new BadRequestException(ErrorTransaction.InvalidTransactionId);
      }
      return parsedId;
    });
  }
}
