import { DbEntityState } from "./db-entity-state";

export interface DbEntity<T> {
  id?: number;
  model?: T;
  state: DbEntityState;
}