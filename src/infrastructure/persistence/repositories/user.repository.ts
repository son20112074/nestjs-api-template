import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../core/domain/entities/user.entity';
import { BaseTypeOrmRepository } from '../base.repository';

@Injectable()
export class UserRepository extends BaseTypeOrmRepository<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.repository.findOne({ where: { googleId } });
  }
}
