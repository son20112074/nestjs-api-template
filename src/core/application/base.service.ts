import { NotFoundException } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { IRepository, IQueryOptions } from '../ports/repository.interface';
import { BaseEntity } from '../domain/entities/base.entity';

export abstract class BaseService<T extends BaseEntity> {
  constructor(protected readonly repository: IRepository<T>) {}

  async findById(id: string): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async findAll(options?: IQueryOptions<T>): Promise<T[]> {
    return this.repository.findAll(options);
  }

  async create(entity: DeepPartial<T>): Promise<T> {
    return this.repository.create(entity);
  }

  async update(id: string, entity: DeepPartial<T>): Promise<T> {
    await this.findById(id); // Verify entity exists
    return this.repository.update(id, entity);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Verify entity exists
    await this.repository.delete(id);
  }
} 