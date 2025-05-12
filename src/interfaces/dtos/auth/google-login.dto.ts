import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GoogleLoginDto {
  @ApiProperty({
    description: 'Google OAuth2 ID token from client',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjFiZDY3...',
  })
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
