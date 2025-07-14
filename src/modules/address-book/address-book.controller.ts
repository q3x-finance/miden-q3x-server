import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AddressBookService } from './address-book.service';
import { AddressBookDto } from './address-book.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Address Book')
@Controller('address-book')
export class AddressBookController {
  constructor(private readonly addressBookService: AddressBookService) {}

  // *************************************************
  // **************** GET METHODS *******************
  // *************************************************
  @Get()
  @ApiOperation({
    summary: 'Get all address book entries',
    description: 'Get all address book entries',
  })
  @ApiResponse({
    status: 200,
    description: 'Address book entries fetched successfully',
  })
  async getAllAddressBookEntries(@Query('userAddress') userAddress: string) {
    return this.addressBookService.getAllAddressBookEntries(userAddress);
  }

  // check if name is duplicate
  @Get('check-name-duplicate')
  @ApiOperation({
    summary: 'Check if name is duplicate',
    description: 'Check if name is duplicate',
  })
  @ApiResponse({
    status: 200,
    description: 'Name is duplicate',
  })
  async checkIfNameIsDuplicate(
    @Query('name') name: string,
    @Query('category') category: string,
    @Query('userAddress') userAddress: string,
  ) {
    const dto = { name, category, userAddress };
    return this.addressBookService.checkIfAddressBookNameExists(dto);
  }

  @Get('check-category-exists')
  @ApiOperation({
    summary: 'Check if category exists',
    description: 'Check if category exists',
  })
  @ApiResponse({
    status: 200,
    description: 'Category exists',
  })
  async checkIfCategoryExists(
    @Query('userAddress') userAddress: string,
    @Query('category') category: string,
  ) {
    return this.addressBookService.checkIfCategoryExists(userAddress, category);
  }

  // *************************************************
  // **************** POST METHODS *******************
  // *************************************************
  @Post()
  @ApiOperation({
    summary: 'Create a new address book entry',
    description: 'Create a new address book entry',
  })
  @ApiResponse({
    status: 200,
    description: 'Address book entry created successfully',
  })
  @ApiBody({ type: AddressBookDto })
  async createNewAddressBookEntry(@Body() dto: AddressBookDto) {
    return this.addressBookService.createNewAddressBookEntry(dto);
  }
}
