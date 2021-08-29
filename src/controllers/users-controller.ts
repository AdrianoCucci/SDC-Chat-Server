import { Application } from "express";
import { IDbContext } from "../database/interfaces/db-context";
import { User } from "../models/user";
import { IApiController } from "./interfaces/api-controller";

export class UsersController implements IApiController {
  public configure(expressApp: Application, context: IDbContext) {
    expressApp.route("/users")
      .get(async (request, response) => {
        const users: User[] = await context.users.getAll();
        response.status(200).json(users);
      });
  }
}