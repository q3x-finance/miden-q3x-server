import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { NoteType } from 'src/common/enums/note';

export class AssetDto {
  @IsString()
  faucetId: string;

  @IsString()
  amount: string;
}

export class SendTransactionDto {
  @ApiProperty({ example: '0x1626bd9a976e21100006fc561b6b09' })
  @IsString()
  sender: string;

  @ApiProperty({ example: '0x1626bd9a976e21100006fc561b6b09' })
  @IsString()
  recipient: string;

  @ApiProperty({
    example: [
      {
        faucetId: '0x09bcfc41564f0420000864bbc261d4',
        amount: '1000',
      },
    ],
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssetDto)
  assets: AssetDto[];

  @ApiProperty({ example: true })
  @IsBoolean()
  private: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  recallable: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  recallableTime?: Date;

  @ApiProperty({ example: [1, 2, 3, 4] })
  @IsArray()
  @IsNumber({}, { each: true })
  serialNumber: number[];

  @ApiProperty({ example: NoteType.P2ID })
  @IsEnum(NoteType)
  noteType: NoteType;
}
