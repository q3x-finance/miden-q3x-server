import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AddressBookRepository } from './address-book.repository';
import {
  AddressBookDto,
  AddressBookNameDuplicateDto,
} from './address-book.dto';
import { ErrorAddressBook } from 'src/common/enums/errors';
import { handleError } from 'src/common/utils/errors';

@Injectable()
export class AddressBookService {
  private readonly logger = new Logger(AddressBookService.name);

  constructor(private readonly addressBookRepository: AddressBookRepository) {}

  // *************************************************
  // **************** GET METHODS ******************
  // *************************************************
  async getAllAddressBookEntries(userAddress: string) {
    return this.addressBookRepository.find({ userAddress });
  }

  async checkIfAddressBookNameExists(dto: AddressBookNameDuplicateDto) {
    try {
      const isNameDuplicate = await this.isAddressBookNameDuplicate(
        dto.userAddress,
        dto.name,
        dto.category,
      );
      return isNameDuplicate;
    } catch (error) {
      handleError(error, this.logger);
    }
  }

  async checkIfCategoryExists(userAddress: string, category: string) {
    try {
      const existingCategory = await this.addressBookRepository.findOne({
        userAddress,
        category,
      });
      return existingCategory !== null;
    } catch (error) {
      handleError(error, this.logger);
    }
  }

  // *************************************************
  // **************** POST METHODS ******************
  // *************************************************
  async createNewAddressBookEntry(dto: AddressBookDto) {
    try {
      // check if name is duplicate
      const isNameDuplicate = await this.isAddressBookNameDuplicate(
        dto.userAddress,
        dto.name,
        dto.category,
      );

      if (isNameDuplicate) {
        throw new BadRequestException(ErrorAddressBook.NameAlreadyExists);
      }

      return this.addressBookRepository.create(dto);
    } catch (error) {
      handleError(error, this.logger);
    }
  }

  // *************************************************
  // **************** UTIL METHODS ******************
  // *************************************************
  private async isAddressBookNameDuplicate(
    userAddress: string,
    name: string,
    category: string,
  ) {
    const existingEntry = await this.addressBookRepository.findOne({
      userAddress,
      name,
      category,
    });
    return existingEntry !== null;
  }
}
