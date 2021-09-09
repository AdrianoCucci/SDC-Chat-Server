export class EntityDtoMap<TEntity, TRequest, TResponse> {
  private readonly _handlers: EntityDtoMapHandlers<TEntity, TRequest, TResponse>;

  public constructor(handlers: EntityDtoMapHandlers<TEntity, TRequest, TResponse>) {
    this._handlers = handlers ?? {};
  }

  public toEntity(request: TRequest): TEntity {
    return this._handlers.toEntity ? this._handlers.toEntity({ ...request }) : null;
  }

  public toResponse(entity: TEntity): TResponse {
    return this._handlers.toResponse ? this._handlers.toResponse({ ...entity }) : null;
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
  toEntity?: (request: TRequest) => TEntity;
  toResponse?: (entity: TEntity) => TResponse;
}