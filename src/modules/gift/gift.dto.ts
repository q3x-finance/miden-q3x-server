import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGiftDto {
  @ApiProperty({
    description: 'Sender address',
    example: '0x1626bd9a976e21100006fc561b6b09',
  })
  @IsString()
  @IsNotEmpty()
  senderAddress: string;

  @ApiProperty({
    description: 'Token address or symbol',
    example: '0x1626bd9a976e21100006fc561b6b09',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'Amount',
    example: '1000',
  })
  @IsString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({
    description: 'Serial number',
    example: [1, 2, 3, 4],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  serialNumber: number[];
}

export class ClaimGiftDto {
  @ApiProperty({ description: 'Recipient address' })
  @IsString()
  @IsNotEmpty()
  recipientAddress: string;
}

export class RecallGiftDto {
  @ApiProperty({ description: 'Sender address' })
  @IsString()
  @IsNotEmpty()
  senderAddress: string;
}
