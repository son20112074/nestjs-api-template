import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { User } from '../../domain/entities/user.entity';
import { LoginDto } from '../../../interfaces/dtos/auth/login.dto';
import { TokenResponseDto } from '../../../interfaces/dtos/auth/token.dto';
import { UpdateUserDto } from '@interfaces/dtos/user/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const tokens = await this.generateTokens(user);

    // Update last login timestamp
    await this.userService.update(user.id, { lastLoginAt: new Date() } as UpdateUserDto);

    return tokens;
  }

  async refreshToken(refreshToken: string): Promise<TokenResponseDto> {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });

      const user = await this.userService.findById(decoded.sub);
      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async generateTokens(user: User): Promise<TokenResponseDto> {
    const payload = { sub: user.id, email: user.email, roles: user.roles };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.expiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: parseInt(this.configService.get('jwt.expiresIn')),
    };
  }
}
