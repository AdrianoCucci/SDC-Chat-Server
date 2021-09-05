import { Application } from "express";
import { IDbContext } from "../database/interfaces/db-context";
import { User } from "../models/users/user";
import { UserDto } from "../models/users/user-dto";
import { userMapping } from "../utils/mappings/mappings";
import { IApiController } from "./interfaces/api-controller";

export class UsersController implements IApiController {
  private readonly _route: string = "/api/users";

  public configure(expressApp: Application, context: IDbContext) {
    expressApp.get(this._route, async (request, response) => {
      const users: User[] = await context.users.getAll();
      const dtos: UserDto[] = userMapping.toDtoArray(users);

      response.status(200).json(dtos);
    });
  }
}