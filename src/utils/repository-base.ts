import { DeepPartial, FindManyOptions, FindOneOptions, ObjectID, Repository } from "typeorm";

export abstract class RepositoryBase<T> {
  protected readonly _repository: Repository<T>;

  protected constructor(repository: Repository<T>) {
    this._repository = repository;
  }

  public getAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this._repository.find(options);
  }

  public getById(id: EntityID, options?: FindOneOptions<T>): Promise<T> {
    return this._repository.findOneOrFail(id, options);
  }

  public async hasAny(id: EntityID): Promise<boolean> {
    const entity: T = await this._repository.findOne(id);
    return entity !== undefined || entity !== null;
  }

  public async add(entity: DeepPartial<T>): Promise<T> {
    const inserted: T = this._repository.create(entity);
    return await this._repository.save(inserted);
  }

  public async addMany(entities: DeepPartial<T>[]): Promise<T[]> {
    const inserted: T[] = this._repository.create(entities);
    return await this._repository.save(inserted);
  }

  public update(entity: DeepPartial<T>): Promise<T> {
    return this._repository.save(entity);
  }

  public updateMany(entities: DeepPartial<T>[]): Promise<T[]> {
    return this._repository.save(entities);
  }

  public delete(entity: T): Promise<T> {
    return this._repository.remove(entity);
  }

  public deleteMany(entities: T[]): Promise<T[]> {
    return this._repository.remove(entities);
  }
}

type EntityID = string | number | Date | ObjectID;