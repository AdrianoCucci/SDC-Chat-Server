export class EntityDtoMap<TEntity, TDto> {
  private readonly _handlers: EntityDtoMapHandlers<TEntity, TDto>;

  public constructor(handlers: EntityDtoMapHandlers<TEntity, TDto>) {
    this._handlers = handlers ?? {};
  }

  public mapEntity(dto: Partial<TDto>, target?: TEntity): TEntity {
    let entity: TEntity = null;

    if (dto != null && this._handlers.mapEntity != null) {
      entity = this._handlers.mapEntity({ ...dto }, target);
    }

    return entity;
  }

  public mapDto(entity: TEntity): TDto {
    let dto: TDto = null;

    if (entity != null && this._handlers.mapDto != null) {
      dto = this._handlers.mapDto({ ...entity });
    }

    return dto;
  }

  public mapEntities(dtos: TDto[]): TEntity[] {
    const entities: TEntity[] = [];

    if (dtos != null) {
      const length: number = dtos.length;

      for (let i = 0; i < length; i++) {
        const entity: TEntity = this.mapEntity(dtos[i]);

        if (entity != null) {
          entities.push(entity);
        }
      }
    }

    return entities;
  }

  public mapDtos(entities: TEntity[]): TDto[] {
    const dtos: TDto[] = [];

    if (entities != null) {
      const length: number = entities.length;

      for (let i = 0; i < length; i++) {
        const dto: TDto = this.mapDto(entities[i]);

        if (dto != null) {
          dtos.push(dto);
        }
      }
    }

    return dtos;
  }
}

interface EntityDtoMapHandlers<TEntity, TDto> {
  mapEntity?: (dto: Partial<TDto>, target?: TEntity) => TEntity;
  mapDto?: (entity: TEntity) => TDto;
}
