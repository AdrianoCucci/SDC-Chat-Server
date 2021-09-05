export interface IDbSet<T> {
  tableName: string;

  getAll(): Promise<T[]>;

  getById(entityId: number): Promise<T>;

  find(predicate: (entity: T) => boolean): Promise<T>;

  findAll(predicate: (entity: T) => boolean): Promise<T[]>;

  add(entity: T): void;

  update(entityId: number, newEntity: T): void;
  
  delete(entityId: number): void;

  commit(): Promise<number>
}