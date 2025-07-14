import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindManyOptions } from 'typeorm';
import { TransactionEntity } from './transaction.entity';

@Injectable()
export class TransactionRepository {
  private readonly logger = new Logger(TransactionRepository.name);

  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionEntityRepository: Repository<TransactionEntity>,
  ) {}

  public async findOne(
    where: FindOptionsWhere<TransactionEntity>,
  ): Promise<TransactionEntity | null> {
    return this.transactionEntityRepository.findOne({ where });
  }

  public async find(
    where: FindOptionsWhere<TransactionEntity>,
    options?: FindManyOptions<TransactionEntity>,
  ): Promise<TransactionEntity[]> {
    return this.transactionEntityRepository.find({ where, ...options });
  }

  public async create(
    dto: Partial<TransactionEntity>,
  ): Promise<TransactionEntity> {
    return this.transactionEntityRepository.create(dto).save();
  }

  public async createMany(
    dtos: Partial<TransactionEntity>[],
  ): Promise<TransactionEntity[]> {
    const entities = this.transactionEntityRepository.create(dtos);
    return this.transactionEntityRepository.save(entities);
  }

  public async update(
    where: FindOptionsWhere<TransactionEntity>,
    dto: Partial<TransactionEntity>,
  ): Promise<TransactionEntity> {
    return this.transactionEntityRepository
      .update(where, dto)
      .then(() => this.findOne(where));
  }

  public async updateMany(
    where: FindOptionsWhere<TransactionEntity>,
    dto: Partial<TransactionEntity>,
  ): Promise<number> {
    const result = await this.transactionEntityRepository.update(where, dto);
    return result.affected;
  }
}
