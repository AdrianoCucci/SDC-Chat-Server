import { EntityChangeTracker } from "./entity-change-tracker";

export class DbSet<T> {
  private readonly _changeTracker = new EntityChangeTracker<T>();
  private readonly _inMemoryData = new Map<number, T>();

  public async getAll(): Promise<T[]> {
    return Array.from(this._inMemoryData.values());
  }

  public async getById(entityId: number): Promise<T> {
    return this._inMemoryData.has(entityId) ? this._inMemoryData.get(entityId) : null;
  }

  public add(entity: T): DbSet<T> {
    this._changeTracker.setAdd(entity);
    return this;
  }

  public update(newEntity: T, updateID: number): DbSet<T> {
    this._changeTracker.setUpdate(newEntity, updateID);
    return this;
  }

  public delete(entity: T, deleteID: number): DbSet<T> {
    this._changeTracker.setDelete(entity, deleteID);
    return this;
  }

  public async commit(): Promise<DbSet<T>> {
    for(let i = 0; i < this._changeTracker.additions.length; i++) {
      //Insert into DB.
      this._inMemoryData.set(this._inMemoryData.size + 1, this._changeTracker.additions[i]);
    }

    this._changeTracker.updates.forEach((id: number, entity: T) => {
      //Update entity in DB on ID.
      this._inMemoryData.set(id, entity);
    });

    this._changeTracker.deletions.forEach((id: number) => {
      //Delete entity in DB on ID.
      this._inMemoryData.delete(id);
    });

    this._changeTracker.clear();
    return this;
  }
}