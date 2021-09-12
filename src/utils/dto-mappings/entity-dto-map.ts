export class EntityDtoMap<TEntity, TRequest, TResponse> {
  private readonly _handlers: EntityDtoMapHandlers<TEntity, TRequest, TResponse>;

  public constructor(handlers: EntityDtoMapHandlers<TEntity, TRequest, TResponse>) {
    this._handlers = handlers ?? {};
  }

  public toEntity(request: TRequest, target?: TEntity): TEntity {
    let result: TEntity = null;

    if(request != null && this._handlers.toEntity != null) {
      result = this._handlers.toEntity({ ...request }, target);
    }

    return result;
  }

  public toResponse(entity: TEntity): TResponse {
    let result: TResponse = null;

    if(entity != null && this._handlers.toResponse != null) {
      result = this._handlers.toResponse({ ...entity });
    }

    return result;
  }

  public toEntities(requests: TRequest[]): TEntity[] {
    const entities: TEntity[] = [];

    if(requests != null) {
      const length: number = requests.length;

      for(let i = 0; i < length; i++) {
        const entity: TEntity = this.toEntity(requests[i]);

        if(entity != null) {
          entities.push(entity);
        }
      }
    }

    return entities;
  }

  public toResponses(entities: TEntity[]): TResponse[] {
    const responses: TResponse[] = [];

    if(entities != null) {
      const length: number = entities.length;

      for(let i = 0; i < length; i++) {
        const response: TResponse = this.toResponse(entities[i]);

        if(response != null) {
          responses.push(response);
        }
      }
    }

    return responses;
  }
}

interface EntityDtoMapHandlers<TEntity, TRequest, TResponse> {
  toEntity?: (request: TRequest, target?: TEntity) => TEntity;
  toResponse?: (entity: TEntity) => TResponse;
}