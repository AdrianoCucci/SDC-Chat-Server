export class EntityDtoMap<TEntity, TDto> {
  private readonly _handlers: EntityDtoMapHandlers<TEntity, TDto>;

  public constructor(handlers: EntityDtoMapHandlers<TEntity, TDto>) {
    this._handlers = handlers ?? {};
  }

  public toDto(entity: TEntity): TDto {
    return this._handlers.toDto ? this._handlers.toDto({ ...entity }) : null;
  }

  public toEntity(dto: TDto): TEntity {
    return this._handlers.toEntity ? this._handlers.toEntity({ ...dto }) : null;
  }

  public toDtoArray(entities: TEntity[]): TDto[] {
    const dtos: TDto[] = [];

    if(entities != null) {
      const length: number = entities.length;

      for(let i = 0; i < length; i++) {
        const dto: TDto = this.toDto(entities[i]);

        if(dto != null) {
          dtos.push(dto);
        }
      }
    }

    return dtos;
  }

  public toEntityArray(dtos: TDto[]): TEntity[] {
    const entities: TEntity[] = [];

    if(dtos != null) {
      const length: number = dtos.length;

      for(let i = 0; i < length; i++) {
        const entity: TEntity = this.toEntity(dtos[i]);

        if(entity != null) {
          entities.push(entity);
        }
      }
    }

    return entities;
  }
}

interface EntityDtoMapHandlers<TEntity, TDto> {
  toDto?: (entity: TEntity) => TDto;
  toEntity?: (dto: TDto) => TEntity;
}