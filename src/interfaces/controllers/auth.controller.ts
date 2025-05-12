import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../../core/application/services/auth.service';
import { GoogleAuthService } from '../../core/application/services/google-auth.service';
import { LoginDto } from '../dtos/auth/login.dto';
import { GoogleLoginDto } from '../dtos/auth/google-login.dto';
import { TokenResponseDto, RefreshTokenDto } from '../dtos/auth/token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful', type: TokenResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<TokenResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Google' })
  @ApiResponse({ status: 200, description: 'Login successful', type: TokenResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto): Promise<TokenResponseDto> {
    return this.googleAuthService.validateGoogleToken(googleLoginDto.idToken);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully', type: TokenResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokenResponseDto> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
