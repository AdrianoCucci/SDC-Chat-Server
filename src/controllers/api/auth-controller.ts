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
import { requireBody } from "../middlewares/require-body";

export class AuthController implements IApiController {
  private readonly _route: string = "/api/authentication";

  private readonly _context: IDbContext;
  private readonly _mapper: MapperService;

  public constructor(context: IDbContext, mapper: MapperService) {
    this._context = context;
    this._mapper = mapper;
  }

  public configure(expressApp: Application): void {
    expressApp.post(`${this._route}/login`, requireBody, async (request, response) => {
      try {
        const authRequest: AuthRequest = request.body;
        const user: User = await this._context.users.find(u => u.username === authRequest.username && u.password === authRequest.password);

        if(user == null) {
          throw new ApiControllerError(401, "Login credentials are invalid");
        }
        
        const userDto: UserDto = this._mapper.users.toDto(user);
        const jwt: string = new JwtProvider().generateToken(userDto);

        const authResponse: AuthResponse = {
          isSuccess: true,
          token: jwt,
          user: userDto
        };

        response.status(200).json(authResponse);
      }
      catch(error) {
        handleApiControllerError(error, response);
      }
    });
  }
}