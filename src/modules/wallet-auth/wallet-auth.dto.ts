import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsObject,
  Length,
  Matches,
} from 'class-validator';
import { DeviceType } from './wallet-auth.entity';

export class InitiateAuthDto {
  @ApiProperty({ description: 'Wallet address' })
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid wallet address format' })
  walletAddress: string;

  @ApiPropertyOptional({ description: 'Device fingerprint for security' })
  @IsOptional()
  @IsString()
  deviceFingerprint?: string;

  @ApiPropertyOptional({ enum: DeviceType, description: 'Device type' })
  @IsOptional()
  @IsEnum(DeviceType)
  deviceType?: DeviceType;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class RegisterKeyDto {
  @ApiProperty({ description: 'Wallet address' })
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid wallet address format' })
  walletAddress: string;

  @ApiProperty({ description: 'Public key for verification' })
  @IsString()
  @Length(64, 128, { message: 'Invalid public key length' })
  publicKey: string;

  @ApiProperty({ description: 'Challenge code from initiate step' })
  @IsString()
  challengeCode: string;

  @ApiProperty({
    description: 'Response to challenge (signed with private key)',
  })
  @IsString()
  challengeResponse: string;

  @ApiPropertyOptional({ description: 'Device fingerprint for security' })
  @IsOptional()
  @IsString()
  deviceFingerprint?: string;

  @ApiPropertyOptional({ enum: DeviceType, description: 'Device type' })
  @IsOptional()
  @IsEnum(DeviceType)
  deviceType?: DeviceType;

  @ApiPropertyOptional({
    description: 'Key expiration time in hours (default: 720 = 30 days)',
  })
  @IsOptional()
  expirationHours?: number;
}

export class AuthenticateDto {
  @ApiProperty({ description: 'Wallet address' })
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid wallet address format' })
  walletAddress: string;

  @ApiProperty({ description: 'Public key identifier' })
  @IsString()
  publicKey: string;

  @ApiProperty({ description: 'Signature created with private key' })
  @IsString()
  signature: string;

  @ApiProperty({
    description: 'Timestamp of the signature (for replay protection)',
  })
  @IsString()
  timestamp: string;

  @ApiPropertyOptional({ description: 'Device fingerprint for security' })
  @IsOptional()
  @IsString()
  deviceFingerprint?: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Current session token' })
  @IsString()
  sessionToken: string;

  @ApiProperty({ description: 'Wallet address' })
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid wallet address format' })
  walletAddress: string;
}

export class RevokeKeyDto {
  @ApiProperty({ description: 'Wallet address' })
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid wallet address format' })
  walletAddress: string;

  @ApiPropertyOptional({
    description: 'Specific public key to revoke (if not provided, revokes all)',
  })
  @IsOptional()
  @IsString()
  publicKey?: string;
}

export class RevokeSessionDto {
  @ApiProperty({ description: 'Session token to revoke' })
  @IsString()
  sessionToken: string;
}

export interface AuthResponse {
  sessionToken: string;
  expiresAt: string;
  walletAddress: string;
  publicKey: string;
}

export interface InitiateAuthResponse {
  challengeCode: string;
  expiresAt: string;
  instructions: string;
}

export interface RegisterKeyResponse {
  publicKey: string;
  expiresAt: string;
  status: string;
}

export interface KeyInfo {
  publicKey: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  lastUsedAt: string | null;
  deviceType: DeviceType;
  deviceFingerprint: string | null;
}

export interface SessionInfo {
  sessionToken: string;
  createdAt: string;
  expiresAt: string;
  lastActivityAt: string | null;
  isActive: boolean;
  ipAddress: string | null;
  userAgent: string | null;
}

export class GetKeysDto {
  @ApiProperty({ description: 'Wallet address' })
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid wallet address format' })
  walletAddress: string;
}

export class GetSessionsDto {
  @ApiProperty({ description: 'Wallet address' })
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid wallet address format' })
  walletAddress: string;

  @ApiPropertyOptional({ description: 'Include inactive sessions' })
  @IsOptional()
  @IsBoolean()
  includeInactive?: boolean;
}
