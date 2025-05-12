import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';
import { IRepository, IQueryOptions } from '../../core/ports/repository.interface';
import { BaseEntity } from '../../core/domain/entities/base.entity';

export abstract class BaseTypeOrmRepository<T extends BaseEntity> implements IRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async findById(id: string): Promise<T | null> {
    const where = { id } as FindOptionsWhere<T>;
    return this.repository.findOne({ where });
  }

  async findAll(options?: IQueryOptions<T>): Promise<T[]> {
    return this.repository.find({
      skip: options?.skip,
      take: options?.take,
      where: options?.where,
      relations: options?.relations,
      order: options?.order,
    });
  }

  async create(entity: DeepPartial<T>): Promise<T> {
    const newEntity = this.repository.create(entity);
    return this.repository.save(newEntity);
  }

  async update(id: string, entity: DeepPartial<T>): Promise<T> {
    const where = { id } as FindOptionsWhere<T>;
    await this.repository.update(where, entity as any);
    return this.findById(id) as Promise<T>;
  }

  async delete(id: string): Promise<void> {
    const where = { id } as FindOptionsWhere<T>;
    await this.repository.delete(where);
  }
}
