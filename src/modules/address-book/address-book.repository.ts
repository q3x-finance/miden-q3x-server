import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsWhere,
  FindOneOptions,
  FindManyOptions,
} from 'typeorm';
import { AddressBookEntity } from './address-book.entity';
import { AddressBookDto } from './address-book.dto';

@Injectable()
export class AddressBookRepository {
  constructor(
    @InjectRepository(AddressBookEntity)
    private readonly addressBookRepository: Repository<AddressBookEntity>,
  ) {}

  public async create(dto: AddressBookDto): Promise<AddressBookEntity> {
    return this.addressBookRepository.create(dto).save();
  }

  public async findOne(
    where: FindOptionsWhere<AddressBookEntity>,
    options?: FindOneOptions<AddressBookEntity>,
  ): Promise<AddressBookEntity | null> {
    const addressBookEntity = await this.addressBookRepository.findOne({
      where,
      ...options,
    });

    return addressBookEntity;
  }

  public find(
    where: FindOptionsWhere<AddressBookEntity>,
    options?: FindManyOptions<AddressBookEntity>,
  ): Promise<AddressBookEntity[]> {
    return this.addressBookRepository.find({
      where,
      order: {
        createdAt: 'DESC',
      },
      ...options,
    });
  }
}
