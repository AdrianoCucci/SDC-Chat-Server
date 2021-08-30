import { EntityChangeTracker } from "./entity-change-tracker";
import { DbEntityState } from "./models/db-entity-state";
import { IDbSet } from "./interfaces/db-set";
import { DbEntity } from "./models/db-entity";

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
    this._changeTracker.trackAdd(entity);
  }

  public update(entityId: number, newEntity: T): void {
    this._changeTracker.trackUpdate(entityId, newEntity);
  }

  public delete(entityId: number): void {
    this._changeTracker.trackDelete(entityId);
  }

  public async commit(): Promise<number> {
    let changes: number = 0;

    for(let i = 0; i < this._changeTracker.changes.length; i++) {
      const dbEntity: DbEntity<T> = this._changeTracker.changes[i];

      switch(dbEntity.state) {
        case DbEntityState.Add: {
          (dbEntity.model as any).$ID = this._nextId;
          this._inMemoryData.set(this._nextId, dbEntity.model);

          this._nextId++;
          changes++;
          break;
        }
        case DbEntityState.Update: {
          this._inMemoryData.set(dbEntity.id, dbEntity.model);
          changes++;
          break;
        }
        case DbEntityState.Delete: {
          this._inMemoryData.delete(dbEntity.id);
          changes++;
          break;
        }
      }
    }
    
    this._changeTracker.clear();
    return changes;
  }
}