import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
  IsDate,
  IsObject,
  IsUrl,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../../shared/decorators/roles.decorator';
import { Type } from 'class-transformer';

export class GoogleProfileDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  picture?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  locale?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  verifiedEmail?: boolean;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'StrongPass123!' })
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ enum: Role, isArray: true, example: [Role.USER] })
  @IsOptional()
  @IsEnum(Role, { each: true })
  @IsArray()
  roles?: Role[];

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  // Google OAuth fields
  @ApiPropertyOptional({ description: 'Google account ID' })
  @IsString()
  @IsOptional()
  googleId?: string;

  @ApiPropertyOptional({ description: 'Google account email' })
  @IsEmail()
  @IsOptional()
  googleEmail?: string;

  @ApiPropertyOptional({ description: 'Google profile information' })
  @IsObject()
  @IsOptional()
  @Type(() => GoogleProfileDto)
  googleProfile?: GoogleProfileDto;

  @ApiPropertyOptional({ description: 'Google access token' })
  @IsString()
  @IsOptional()
  googleAccessToken?: string;

  @ApiPropertyOptional({ description: 'Google refresh token' })
  @IsString()
  @IsOptional()
  googleRefreshToken?: string;

  // Profile fields
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  timezone?: string;

  // Security fields
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isEmailVerified?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isTwoFactorEnabled?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  twoFactorSecret?: string;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  lastLoginAt?: Date;

  // Organization fields
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  employeeId?: string;

  @ApiPropertyOptional({ description: 'Additional metadata as JSON' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ description: 'User preferences as JSON' })
  @IsObject()
  @IsOptional()
  preferences?: Record<string, any>;
}
