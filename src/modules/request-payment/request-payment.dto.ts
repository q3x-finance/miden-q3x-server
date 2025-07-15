import { IsString, IsEnum, IsNumberString, IsNotEmpty } from 'class-validator';
import { RequestPaymentStatus } from './request-payment.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestPaymentDto {
  @ApiProperty({
    description: 'The address of the payer',
    example: '0x1626bd9a976e21100006fc561b6b09',
  })
  @IsNotEmpty()
  @IsString()
  payer: string;

  @ApiProperty({
    description: 'The address of the payee',
    example: '0x1626bd9a976e21100006fc561b6b09',
  })
  @IsNotEmpty()
  @IsString()
  payee: string;

  @ApiProperty({
    description: 'The amount of the request',
    example: '1000',
  })
  @IsNotEmpty()
  @IsNumberString()
  amount: string;

  @ApiProperty({
    description: 'The token of the request',
    example: '0x1626bd9a976e21100006fc561b6b09',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description: 'The message of the request',
    example: 'Please send me the money',
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}

export class UpdateRequestPaymentStatusDto {
  @IsEnum(RequestPaymentStatus)
  status: RequestPaymentStatus;
}
