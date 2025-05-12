import { FindOptionsOrder, FindOptionsWhere, DeepPartial } from 'typeorm';
import { BaseEntity } from '../domain/entities/base.entity';

export interface IRepository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  findAll(options?: IQueryOptions<T>): Promise<T[]>;
  create(entity: DeepPartial<T>): Promise<T>;
  update(id: string, entity: DeepPartial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface IQueryOptions<T extends BaseEntity = any> {
  skip?: number;
  take?: number;
  where?: FindOptionsWhere<T>;
  relations?: string[];
  order?: FindOptionsOrder<T>;
}
