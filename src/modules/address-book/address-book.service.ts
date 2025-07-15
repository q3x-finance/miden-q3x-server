import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AddressBookRepository } from './address-book.repository';
import {
  AddressBookDto,
  AddressBookNameDuplicateDto,
} from './address-book.dto';
import { ErrorAddressBook } from 'src/common/enums/errors';
import { handleError } from 'src/common/utils/errors';
import {
  validateAddress,
  validateName,
  validateCategory,
  normalizeAddress,
  validateDifferentAddresses,
  sanitizeString,
} from 'src/common/utils/validation.util';

@Injectable()
export class AddressBookService {
  private readonly logger = new Logger(AddressBookService.name);

  constructor(private readonly addressBookRepository: AddressBookRepository) {}

  // *************************************************
  // **************** GET METHODS ******************
  // *************************************************
  async getAllAddressBookEntries(userAddress: string) {
    try {
      // Validate user address
      validateAddress(userAddress, 'userAddress');

      const normalizedUserAddress = normalizeAddress(userAddress);

      return this.addressBookRepository.find({
        userAddress: normalizedUserAddress,
      });
    } catch (error) {
      handleError(error, this.logger);
    }
  }

  async checkIfAddressBookNameExists(dto: AddressBookNameDuplicateDto) {
    try {
      // Validate inputs
      validateAddress(dto.userAddress, 'userAddress');
      validateName(dto.name, 'name');
      validateCategory(dto.category, 'category');

      const normalizedUserAddress = normalizeAddress(dto.userAddress);
      const sanitizedName = sanitizeString(dto.name);
      const sanitizedCategory = sanitizeString(dto.category);

      const isNameDuplicate = await this.isAddressBookNameDuplicate(
        normalizedUserAddress,
        sanitizedName,
        sanitizedCategory,
      );
      return isNameDuplicate;
    } catch (error) {
      handleError(error, this.logger);
    }
  }

  async checkIfCategoryExists(userAddress: string, category: string) {
    try {
      // Validate inputs
      validateAddress(userAddress, 'userAddress');
      validateCategory(category, 'category');

      const normalizedUserAddress = normalizeAddress(userAddress);
      const sanitizedCategory = sanitizeString(category);

      const existingCategory = await this.addressBookRepository.findOne({
        userAddress: normalizedUserAddress,
        category: sanitizedCategory,
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
      // Validate all inputs
      validateAddress(dto.userAddress, 'userAddress');
      validateAddress(dto.address, 'address');
      validateName(dto.name, 'name');
      validateCategory(dto.category, 'category');

      if (dto.token) {
        validateAddress(dto.token, 'token');
      }

      // Normalize addresses
      const normalizedUserAddress = normalizeAddress(dto.userAddress);
      const normalizedAddress = normalizeAddress(dto.address);
      const normalizedToken = dto.token
        ? normalizeAddress(dto.token)
        : undefined;

      // Check if user is trying to add their own address
      validateDifferentAddresses(
        normalizedUserAddress,
        normalizedAddress,
        'userAddress',
        'address',
      );

      // Sanitize string inputs
      const sanitizedName = sanitizeString(dto.name);
      const sanitizedCategory = sanitizeString(dto.category);

      // Check if name is duplicate in the same category
      const isNameDuplicate = await this.isAddressBookNameDuplicate(
        normalizedUserAddress,
        sanitizedName,
        sanitizedCategory,
      );

      if (isNameDuplicate) {
        throw new BadRequestException(ErrorAddressBook.NameAlreadyExists);
      }

      // Check if address already exists in the same category
      const isAddressDuplicate = await this.isAddressBookAddressDuplicate(
        normalizedUserAddress,
        normalizedAddress,
        sanitizedCategory,
      );

      if (isAddressDuplicate) {
        throw new BadRequestException(ErrorAddressBook.AddressAlreadyExists);
      }

      // Create the entry with normalized and sanitized data
      const createDto = {
        userAddress: normalizedUserAddress,
        address: normalizedAddress,
        name: sanitizedName,
        category: sanitizedCategory,
        token: normalizedToken,
      };

      return this.addressBookRepository.create(createDto);
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
  ): Promise<boolean> {
    const existingEntry = await this.addressBookRepository.findOne({
      userAddress,
      name,
      category,
    });
    return existingEntry !== null;
  }

  private async isAddressBookAddressDuplicate(
    userAddress: string,
    address: string,
    category: string,
  ): Promise<boolean> {
    const existingEntry = await this.addressBookRepository.findOne({
      userAddress,
      address,
      category,
    });
    return existingEntry !== null;
  }
}
