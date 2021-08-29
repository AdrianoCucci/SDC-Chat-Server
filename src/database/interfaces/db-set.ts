export interface IDbSet<T> {
  tableName: string;

  getAll(): Promise<T[]>;

  getById(entityId: number): Promise<T>;

  add(entity: T): void;

  update(newEntity: T, updateID: number): void;
  
  delete(entity: T, deleteID: number): void;

  commit(): Promise<number>
}