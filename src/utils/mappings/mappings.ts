import { User } from "../../models/users/user";
import { UserDto } from "../../models/users/user-dto";
import { EntityMapper } from "./entity-mapper";

export const userMapping = new EntityMapper<User, UserDto>({
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