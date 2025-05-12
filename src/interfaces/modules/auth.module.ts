import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../../core/application/services/auth.service';
import { GoogleAuthService } from '../../core/application/services/google-auth.service';
import { UserModule } from './user.module';
import { JwtStrategy } from '../../infrastructure/auth/strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleAuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
