import { Injectable } from "@nestjs/common";
import { User } from "src/models/users/user";
import { UserRequest } from "src/models/users/user-request";
import { UserResponse } from "src/models/users/user-response";
import { EntityDtoMap } from "./entity-dto-map";

@Injectable()
export class MapperService {
  public readonly users = new EntityDtoMap<User, UserRequest, UserResponse>({
    toEntity: (request: UserRequest): User => {
      const user: User = request as any;
      user.isOnline = request.isOnline == null ? false : request.isOnline;

      return user;
    },

    toResponse: (entity: User): UserResponse => {
      delete entity.password;
      return entity;
    }
  });
}