import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsArray, IsBoolean, IsUrl, IsObject, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../../shared/decorators/roles.decorator';
import { Type } from 'class-transformer';
import { GoogleProfileDto } from './update-user.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'StrongPass123!' })
  @IsString()
  @MinLength(8)
  @IsOptional() // Optional because of social login
  password?: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

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
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  lastLoginAt?: Date;
} 