import { User } from "../models/users/user";
import { UserDto } from "../models/users/user-dto";
import { EntityDtoMap } from "../utils/entity-dto-map";

export class MapperService {
  public readonly users = new EntityDtoMap<User, UserDto>({
    toEntity: (dto: UserDto) => {
      const entity: User = dto as any;
      entity.password = null;
  
      return entity;
    },
  
    toDto: (entity: User) => {
      delete entity.password;
      return entity;
    }
  });
}