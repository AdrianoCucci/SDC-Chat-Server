export class EntityDtoMap<TEntity, TRequest, TResponse> {
  private readonly _handlers: EntityDtoMapHandlers<TEntity, TRequest, TResponse>;

  public constructor(handlers: EntityDtoMapHandlers<TEntity, TRequest, TResponse>) {
    this._handlers = handlers ?? {};
  }

  public mapEntity(request: TRequest, target?: TEntity): TEntity {
    let result: TEntity = null;

    if(request != null && this._handlers.mapEntity != null) {
      result = this._handlers.mapEntity({ ...request }, target);
    }

    return result;
  }

  public mapResponse(entity: TEntity): TResponse {
    let result: TResponse = null;

    if(entity != null && this._handlers.mapResponse != null) {
      result = this._handlers.mapResponse({ ...entity });
    }

    return result;
  }

  public mapEntities(requests: TRequest[]): TEntity[] {
    const entities: TEntity[] = [];

    if(requests != null) {
      const length: number = requests.length;

      for(let i = 0; i < length; i++) {
        const entity: TEntity = this.mapEntity(requests[i]);

        if(entity != null) {
          entities.push(entity);
        }
      }
    }

    return entities;
  }

  public mapResponses(entities: TEntity[]): TResponse[] {
    const responses: TResponse[] = [];

    if(entities != null) {
      const length: number = entities.length;

      for(let i = 0; i < length; i++) {
        const response: TResponse = this.mapResponse(entities[i]);

        if(response != null) {
          responses.push(response);
        }
      }
    }

    return responses;
  }
}

interface EntityDtoMapHandlers<TEntity, TRequest, TResponse> {
  mapEntity?: (request: TRequest, target?: TEntity) => TEntity;
  mapResponse?: (entity: TEntity) => TResponse;
}