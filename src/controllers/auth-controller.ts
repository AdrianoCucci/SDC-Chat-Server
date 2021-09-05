import { Application } from "express";
import { IDbContext } from "../database/interfaces/db-context";
import { AuthRequest } from "../models/auth/auth-request";
import { AuthResponse } from "../models/auth/auth-response";
import { User } from "../models/users/user";
import { UserDto } from "../models/users/user-dto";
import { MapperService } from "../services/mapper-service";
import { ApiControllerError } from "../utils/api-controller-error";
import { JwtProvider } from "../utils/jwt-provider";
import { IApiController } from "./interfaces/api-controller";

export class AuthController implements IApiController {
  private readonly _route: string = "/api/authentication";
  private readonly _mapper: MapperService;

  public constructor(mapper: MapperService) {
    this._mapper = mapper;
  }

  public configure(expressApp: Application, context: IDbContext): void {
    expressApp.post(`${this._route}/login`, async (request, response) => {
      try {
        const authRequest: AuthRequest = request.body;
        if(authRequest == null) {
          throw new ApiControllerError(400, { isSuccess: false, message: "Authentication request body is missing" } as AuthResponse);
        }

        const user: User = await context.users.find(u => u.username === authRequest.username && u.password === authRequest.password);
        if(user == null) {
          throw new ApiControllerError(401, { isSuccess: false, message: "Login credentials are invalid" } as AuthResponse);
        }
        else {
          user.isOnline = true;
          context.users.update(user.userId, user);
          await context.users.commit();

          const jwt: string = new JwtProvider().generateToken(user.username);
          const userDto: UserDto = this._mapper.users.toDto(user);

          const authResponse: AuthResponse = {
            isSuccess: true,
            token: jwt,
            user: userDto
          };

          response.status(200).send(authResponse);
        }
      }
      catch(error) {
        if(error instanceof ApiControllerError) {
          response.status(error.status).send(error.response);
        }
        else {
          response.status(500).send(error);
        }
      }
    });
  }
}