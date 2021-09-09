import { Injectable } from "@nestjs/common";
import { User } from "src/models/users/user";
import { UserRequest } from "src/models/users/user-request";
import { UserResponse } from "src/models/users/user-response";
import { EntityDtoMap } from "./entity-dto-map";

@Injectable()
export class MapperService {
  public readonly users = new EntityDtoMap<User, UserRequest, UserResponse>({
    toEntity: (request: UserRequest): User => {
      const user = new User();
      Object.assign(user, request);

      return user;
    },

    toResponse: (entity: User): UserResponse => {
      delete entity.password;
      
      const dto = new UserResponse();
      Object.assign(dto, entity);

      return dto;
    }
  });
}