import { Application } from "express";
import { IDbContext } from "../../database/interfaces/db-context";
import { AuthRequest } from "../../models/auth/auth-request";
import { AuthResponse } from "../../models/auth/auth-response";
import { User } from "../../models/users/user";
import { UserDto } from "../../models/users/user-dto";
import { MapperService } from "../../services/mapper-service";
import { ApiControllerError } from "../../utils/api-controller-error";
import { handleApiControllerError } from "../../utils/handle-api-controller-error";
import { JwtProvider } from "../../utils/jwt-provider";
import { IApiController } from "../interfaces/api-controller";

export class AuthController implements IApiController {
  private readonly _route: string = "/api/authentication";

  private readonly _context: IDbContext;
  private readonly _mapper: MapperService;

  public constructor(context: IDbContext, mapper: MapperService) {
    this._context = context;
    this._mapper = mapper;
  }

  public configure(expressApp: Application): void {
    expressApp.post(`${this._route}/login`, async (request, response) => {
      try {
        const authRequest: AuthRequest = request.body;
        if(authRequest == null) {
          throw new ApiControllerError(400, { isSuccess: false, message: "Authentication request body is missing" } as AuthResponse);
        }

        const user: User = await this._context.users.find(u => u.username === authRequest.username && u.password === authRequest.password);
        if(user == null) {
          throw new ApiControllerError(401, { isSuccess: false, message: "Login credentials are invalid" } as AuthResponse);
        }
        else {
          const userDto: UserDto = this._mapper.users.toDto(user);
          const jwt: string = new JwtProvider().generateToken(userDto);

          const authResponse: AuthResponse = {
            isSuccess: true,
            token: jwt,
            user: userDto
          };

          response.status(200).send(authResponse);
        }
      }
      catch(error) {
        handleApiControllerError(error, response);
      }
    });
  }
}