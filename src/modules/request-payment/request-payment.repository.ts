import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import {
  RequestPaymentEntity,
  RequestPaymentStatus,
} from './request-payment.entity';
import { CreateRequestPaymentDto } from './request-payment.dto';

@Injectable()
export class RequestPaymentRepository {
  constructor(
    @InjectRepository(RequestPaymentEntity)
    private readonly repo: Repository<RequestPaymentEntity>,
  ) {}

  async create(dto: CreateRequestPaymentDto): Promise<RequestPaymentEntity> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async find(
    where: FindOptionsWhere<RequestPaymentEntity>,
  ): Promise<RequestPaymentEntity[]> {
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(
    where: FindOptionsWhere<RequestPaymentEntity>,
  ): Promise<RequestPaymentEntity | null> {
    return this.repo.findOne({ where });
  }

  async updateStatus(
    id: number,
    status: RequestPaymentStatus,
  ): Promise<RequestPaymentEntity | null> {
    await this.repo.update(id, { status });
    return this.repo.findOne({ where: { id } });
  }

  async createMany(
    dtos: Partial<RequestPaymentEntity>[],
  ): Promise<RequestPaymentEntity[]> {
    const entities = this.repo.create(dtos);
    return this.repo.save(entities);
  }
}
