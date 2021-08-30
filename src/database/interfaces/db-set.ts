export interface IDbSet<T> {
  tableName: string;

  getAll(): Promise<T[]>;

  getById(entityId: number): Promise<T>;

  add(entity: T): void;

  update(entityId: number, newEntity: T): void;
  
  delete(entityId: number): void;

  commit(): Promise<number>
}