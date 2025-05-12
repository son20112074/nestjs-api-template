import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../../infrastructure/persistence/repositories/user.repository';
import { CreateUserDto } from '../../../interfaces/dtos/user/create-user.dto';
import { UpdateUserDto } from '../../../interfaces/dtos/user/update-user.dto';
import { BaseService } from '../base.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    if (createUserDto.password) {
      const hashedPassword = await this.hashPassword(createUserDto.password);
      createUserDto.password = hashedPassword;
    }

    const user = await super.create(createUserDto);

    // Don't return the password
    delete user.password;
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findByEmail(updateUserDto.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    const user = await super.update(id, updateUserDto);

    // Don't return the password
    delete user.password;
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userRepository.findByGoogleId(googleId);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
