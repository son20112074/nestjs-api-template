import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../../core/application/services/user.service';
import { UserRepository } from '../../infrastructure/persistence/repositories/user.repository';
import { User } from '../../core/domain/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
