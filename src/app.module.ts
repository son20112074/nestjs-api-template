import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig, databaseConfig, jwtConfig } from './infrastructure/config/configuration';
import { UserModule } from './interfaces/modules/user.module';
import { AuthModule } from './interfaces/modules/auth.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),

    // Feature Modules
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
