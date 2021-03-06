import { PagedList } from "src/models/pagination/paged-list";
import { DeepPartial, FindManyOptions, FindOneOptions, ObjectID, Repository } from "typeorm";

export abstract class RepositoryBase<T> {
  protected readonly _repository: Repository<T>;

  protected constructor(repository: Repository<T>) {
    this._repository = repository;
  }

  public getAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this._repository.find(options);
  }

  public getAllByModel(model: DeepPartial<T>): Promise<T[]> {
    return model != null ? this.getAll({ where: model }) : this.getAll();
  }

  public async getAllPaged(options?: FindManyOptions<T>): Promise<PagedList<T>> {
    const data: [T[], number] = await this._repository.findAndCount({
      ...options,
      skip: options?.skip ? Math.abs(options.skip) : null,
      take: options?.take ? Math.abs(options.take) : null
    });

    return new PagedList<T>({
      data: data[0],
      meta: { pagination: options, totalItemsCount: data[1] }
    });
  }

  public getOne(options?: FindOneOptions<T>): Promise<T> {
    return this._repository.findOne(options);
  }

  public getOneById(id: EntityID, options?: FindOneOptions<T>): Promise<T> {
    return this._repository.findOne(id, options);
  }

  public getOneByModel(model: DeepPartial<T>): Promise<T> {
    return model != null ? this.getOne({ where: model }) : this.getOne();
  }

  public async hasAnyWithId(id: EntityID): Promise<boolean> {
    const entity: T = await this._repository.findOne(id);
    return entity !== undefined || entity !== null;
  }

  public async hasAnyWithModel(model: DeepPartial<T>): Promise<boolean> {
    const entities: T[] = await this.getAllByModel(model);
    return entities?.length > 0 ?? false;
  }

  public async add(entity: DeepPartial<T>): Promise<T> {
    const inserted = this._repository.create(entity) as DeepPartial<T>;
    return await this._repository.save(inserted);
  }

  public async addMany(entities: DeepPartial<T>[]): Promise<T[]> {
    const inserted = this._repository.create(entities) as DeepPartial<T>[];
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