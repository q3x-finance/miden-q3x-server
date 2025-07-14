import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddressBookDto {
  @ApiProperty({
    description: 'The address of the user',
    example: '0x1626bd9a976e21100006fc561b6b09',
  })
  @IsNotEmpty()
  @IsString()
  userAddress: string;

  @ApiProperty({
    description: 'The category of the address book entry',
    example: 'Company',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'The name of the address book entry',
    example: 'JuPENG',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The address of the address book entry',
    example: '0x1626bd9a976e21100006fc561b6b09',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'The faucet id of the address book entry',
    example: '0x1626bd9a976e21100006fc561b6b09',
  })
  @IsOptional()
  @IsString()
  token?: string;
}

export class AddressBookNameDuplicateDto {
  @ApiProperty({
    description: 'The name of the address book entry',
    example: 'JuPENG',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The category of the address book entry',
    example: 'Company',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'The address of the address book entry',
    example: '0x1626bd9a976e21100006fc561b6b09',
  })
  @IsString()
  userAddress: string;
}
