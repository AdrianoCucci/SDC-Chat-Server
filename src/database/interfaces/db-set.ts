export interface IDbSet<T> {
  tableName: string;

  getAll(): Promise<T[]>;

  getById(entityId: number): Promise<T>;

  getFirstWhere(predicate: (entity: T) => boolean): Promise<T>;

  getAllWhere(predicate: (entity: T) => boolean): Promise<T[]>;

  add(entity: T): void;

  update(entityId: number, newEntity: T): void;
  
  delete(entityId: number): void;

  commit(): Promise<number>
}