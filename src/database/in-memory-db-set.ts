import { EntityChangeTracker } from "./entity-change-tracker";
import { IDbSet } from "./interfaces/db-set";

export class InMemoryDbSet<T> implements IDbSet<T> {
  public readonly tableName: string;

  private readonly _changeTracker = new EntityChangeTracker<T>();
  private readonly _inMemoryData = new Map<number, T>();
  private _nextId: number = 1;

  public constructor(tableName: string) {
    this.tableName = tableName;
  }

  public async getAll(): Promise<T[]> {
    return Array.from(this._inMemoryData.values());
  }

  public async getById(entityId: number): Promise<T> {
    return this._inMemoryData.has(entityId) ? this._inMemoryData.get(entityId) : null;
  }

  public add(entity: T): void {
    this._changeTracker.setAdd(entity);
  }

  public update(newEntity: T, updateID: number): void {
    this._changeTracker.setUpdate(newEntity, updateID);
  }

  public delete(entity: T, deleteID: number): void {
    this._changeTracker.setDelete(entity, deleteID);
  }

  public async commit(): Promise<number> {
    let changes: number = 0;

    for(let i = 0; i < this._changeTracker.additions.length; i++) {
      //Insert into DB.
      const entity: T = this._changeTracker.additions[i];
      (entity as any).$ID = this._nextId;

      this._inMemoryData.set(this._nextId, entity);
      this._nextId++;

      changes++;
    }

    this._changeTracker.updates.forEach((id: number, entity: T) => {
      //Update entity in DB on ID.
      this._inMemoryData.set(id, entity);
      changes++;
    });

    this._changeTracker.deletions.forEach((id: number) => {
      //Delete entity in DB on ID.
      this._inMemoryData.delete(id);
      changes++;
    });

    this._changeTracker.clear();
    return changes;
  }
}