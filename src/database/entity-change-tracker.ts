import { EntityTrackState } from "./entity-track-state";

export class EntityChangeTracker<T> {
  public readonly additions: T[] = [];
  public readonly updates = new Map<T, number>();
  public readonly deletions = new Map<T, number>();

  public setAdd(entity: T): void {
    const existingState: EntityTrackState = this.getTrackedState(entity);

    if(existingState === EntityTrackState.Update) {
      this.updates.delete(entity);
    }
    else if(existingState === EntityTrackState.Delete) {
      this.deletions.delete(entity);
    }

    if(!this.additions.includes(entity)) {
      this.additions.push(entity);
    }
  }

  public setUpdate(entity: T, updateID: number): void {
    const existingState: EntityTrackState = this.getTrackedState(entity);

    if(existingState === EntityTrackState.Add) {
      this.additions.splice(this.additions.indexOf(entity), 1);
    }
    else if(existingState === EntityTrackState.Delete) {
      this.deletions.delete(entity);
    }

    if(!this.updates.has(entity)) {
      this.updates.set(entity, updateID);
    }
  }

  public setDelete(entity: T, deleteID: number): void {
    const existingState: EntityTrackState = this.getTrackedState(entity);

    if(existingState === EntityTrackState.Add) {
      this.additions.splice(this.additions.indexOf(entity), 1);
    }
    if(existingState === EntityTrackState.Update) {
      this.updates.delete(entity);
    }

    if(!this.deletions.has(entity)) {
      this.deletions.set(entity, deleteID);
    }
  }

  public clear(): void {
    this.additions.splice(0, this.additions.length);
    this.updates.clear();
    this.deletions.clear();
  }

  private getTrackedState(entity: T): EntityTrackState {
    let state: EntityTrackState;

    if(this.additions?.includes(entity)) {
      state = EntityTrackState.Add;
    }
    else if(this.updates?.has(entity)) {
      state = EntityTrackState.Update;
    }
    else if(this.deletions?.has(entity)) {
      state = EntityTrackState.Delete;
    }
    else {
      state = null;
    }

    return state;
  }
}