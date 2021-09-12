export abstract class ServiceBase<T> {
  private readonly _entities: T[];
  private readonly _idField: string;

  private _nextId: number = 1;

  protected constructor(idField: string, initialEntities?: T[]) {
    this._idField = idField;
    this._entities = initialEntities ?? [];

    if(this._entities.length > 0) {
      const entityIds: number[] = this._entities.map((entity: T) => entity[this._idField]);
      this._nextId = Math.max(...entityIds) + 1;
    }
  }

  public async getAll(): Promise<T[]> {
    return [...this._entities];
  }

  public async getById(id: number): Promise<T> {
    const entity: T = this._entities.find((entity: T) => entity[this._idField] === id);
    return entity != null ? { ...entity } : null;
  }

  public async idExists(id: number): Promise<boolean> {
    return this._entities.findIndex((entity: T) => entity[this._idField] === id) !== -1;
  }

  public async add(entity: T): Promise<T> {
    entity[this._idField] = this._nextId;

    this._entities.push({ ...entity });
    this._nextId++;

    return entity;
  }

  public async addMany(...entities: T[]): Promise<T[]> {
    const results: T[] = [];

    if(entities != null) {
      for(let i = 0; i < entities.length; i++) {
        const addResult: T = await this.add(entities[i]);
        results.push(addResult);
      }
    }

    return results;
  }

  public async update(entity: T): Promise<T> {
    let result: T = null;
    const index: number = this.findEntityIndex(entity[this._idField]);

    if(index !== -1) {
      result = { ...Object.assign(this._entities[index], entity) };
    }

    return result;
  }

  public async updateMany(...entities: T[]): Promise<T[]> {
    const results: T[] = [];

    if(entities != null) {
      for(let i = 0; i < entities.length; i++) {
        const updateResult: T = await this.update(entities[i]);
        results.push(updateResult);
      }
    }

    return results;
  }

  public async delete(id: number): Promise<boolean> {
    let isSuccess: boolean = false;
    const index: number = this.findEntityIndex((entity: T) => entity[this._idField] === id);

    if(index !== -1) {
      this._entities.splice(index, 1);
      isSuccess = true;
    }

    return isSuccess;
  }

  public async deleteMany(...ids: number[]): Promise<number> {
    let deleteCount: number = 0;

    if(ids != null) {
      for(let i = 0; i < ids.length; i++) {
        if(await this.delete(ids[i])) {
          deleteCount++;
        }
      }
    }

    return deleteCount;
  }

  protected findEntity(predicate: (entity: T) => boolean): T {
    let result: T = this._entities.find(predicate);

    if(result != null) {
      result = { ...result };
    }

    return result;
  }

  protected findEntities(predicate: (entity: T) => boolean): T[] {
    return [...this._entities.filter(predicate)];
  }

  protected findEntityIndex(predicate: (entity: T) => boolean): number {
    return this._entities.findIndex(predicate);
  }

  protected entityExists(predicate: (entity: T) => boolean): boolean {
    return this.findEntityIndex(predicate) !== -1;
  }
}