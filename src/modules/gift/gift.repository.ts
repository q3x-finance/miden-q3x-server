import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindManyOptions } from 'typeorm';
import { GiftEntity } from './gift.entity';

@Injectable()
export class GiftRepository {
  private readonly logger = new Logger(GiftRepository.name);

  constructor(
    @InjectRepository(GiftEntity)
    private readonly giftRepository: Repository<GiftEntity>,
  ) {}

  public async create(dto: Partial<GiftEntity>): Promise<GiftEntity> {
    try {
      const entity = this.giftRepository.create(dto);
      return await entity.save();
    } catch (error) {
      this.logger.error('Error creating gift:', error);
      throw error;
    }
  }

  public async updateOne(
    where: FindOptionsWhere<GiftEntity>,
    dto: Partial<GiftEntity>,
  ): Promise<GiftEntity> {
    try {
      const giftEntity = await this.giftRepository.findOneBy(where);

      if (!giftEntity) {
        this.logger.warn('Gift not found for update:', where);
        throw new Error('Gift not found');
      }

      Object.assign(giftEntity, dto);
      return await giftEntity.save();
    } catch (error) {
      this.logger.error('Error updating gift:', error);
      throw error;
    }
  }

  async findOne(
    where: FindOptionsWhere<GiftEntity>,
  ): Promise<GiftEntity | null> {
    try {
      return await this.giftRepository.findOne({ where });
    } catch (error) {
      this.logger.error('Error finding gift:', error);
      throw error;
    }
  }

  public find(
    where: FindOptionsWhere<GiftEntity>,
    options?: FindManyOptions<GiftEntity>,
  ): Promise<GiftEntity[]> {
    try {
      return this.giftRepository.find({
        where,
        order: {
          createdAt: 'DESC',
        },
        ...options,
      });
    } catch (error) {
      this.logger.error('Error finding gifts:', error);
      throw error;
    }
  }
}
