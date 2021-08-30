import { DbEntity } from "./models/db-entity";
import { DbEntityState } from "./models/db-entity-state";

export class EntityChangeTracker<T> {
  public readonly changes: DbEntity<T>[] = [];

  public trackAdd(entity: T): void {
    const existingEntity: DbEntity<T> = this.changes.find(c => c.model === entity);

    if(existingEntity == null) {
      this.changes.push({
        id: null,
        model: entity,
        state: DbEntityState.Add
      });
    }
    else {
      existingEntity.id = null;
      existingEntity.state = DbEntityState.Add;
    }
  }

  public trackUpdate(entityId: number, entity: T): void {
    const existingEntity: DbEntity<T> = this.changes.find(c => c.id === entityId);

    if(existingEntity == null) {
      this.changes.push({
        id: entityId,
        model: entity,
        state: DbEntityState.Update
      });
    }
    else {
      existingEntity.model = entity;
      existingEntity.state = DbEntityState.Update;
    }
  }

  public trackDelete(entityId: number): void {
    const existingEntity: DbEntity<T> = this.changes.find(c => c.id === entityId);

    if(existingEntity == null) {
      this.changes.push({
        id: entityId,
        state: DbEntityState.Delete
      });
    }
    else {
      existingEntity.state = DbEntityState.Delete;
    }
  }

  public clear() {
    this.changes.splice(0, this.changes.length);
  }
}