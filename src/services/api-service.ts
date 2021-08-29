import { Application } from "express";
import { IApiController } from "../controllers/interfaces/api-controller";
import { UsersController } from "../controllers/users-controller";
import { IDbContext } from "../database/interfaces/db-context";

export class ApiService {
  private readonly _expressApp: Application;
  private readonly _context: IDbContext;
  private readonly _controllers: IApiController[];

  public constructor(expressApp: Application, context: IDbContext) {
    this._expressApp = expressApp;
    this._context = context;

    this._controllers = this.configureControllers();
  }

  private configureControllers(): IApiController[] {
    const controllers: IApiController[] = [
      new UsersController()
    ];

    for (let i = 0; i < controllers.length; i++) {
      controllers[i].configure(this._expressApp, this._context);      
    }

    return controllers;
  }
}