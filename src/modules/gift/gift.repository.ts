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
    return this.giftRepository.create(dto).save();
  }

  public async updateOne(
    where: FindOptionsWhere<GiftEntity>,
    dto: Partial<GiftEntity>,
  ): Promise<GiftEntity> {
    const giftEntity = await this.giftRepository.findOneBy(where);

    if (!giftEntity) {
      this.logger.log('none');
      throw new Error();
    }

    Object.assign(giftEntity, dto);
    return giftEntity.save();
  }

  async findOne(
    where: FindOptionsWhere<GiftEntity>,
  ): Promise<GiftEntity | null> {
    return this.giftRepository.findOne({ where });
  }

  public find(
    where: FindOptionsWhere<GiftEntity>,
    options?: FindManyOptions<GiftEntity>,
  ): Promise<GiftEntity[]> {
    return this.giftRepository.find({
      where,
      order: {
        createdAt: 'DESC',
      },
      ...options,
    });
  }
}
