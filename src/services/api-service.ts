import { Application } from "express";
import { AuthController } from "../controllers/api/auth-controller";
import { ChatMessagesController } from "../controllers/api/chat-messages-controller";
import { OrganizationsController } from "../controllers/api/organizations-controller";
import { RoomsController } from "../controllers/api/rooms-controller";
import { UsersController } from "../controllers/api/users-controller";
import { IApiController } from "../controllers/interfaces/api-controller";
import { IDbContext } from "../database/interfaces/db-context";
import { MapperService } from "./mapper-service";

export class ApiService {
  private readonly _expressApp: Application;
  private readonly _context: IDbContext;

  private readonly _mapper: MapperService;
  private readonly _controllers: IApiController[];

  public constructor(expressApp: Application, context: IDbContext, mapper: MapperService) {
    this._expressApp = expressApp;
    this._context = context;

    this._mapper = mapper;
    this._controllers = this.configureControllers();
  }

  private configureControllers(): IApiController[] {
    const controllers: IApiController[] = [
      new AuthController(this._context, this._mapper),
      new UsersController(this._context, this._mapper),
      new ChatMessagesController(this._context),
      new OrganizationsController(this._context, this._mapper),
      new RoomsController(this._context, this._mapper)
    ];

    for (let i = 0; i < controllers.length; i++) {
      controllers[i].configure(this._expressApp);      
    }

    return controllers;
  }
}