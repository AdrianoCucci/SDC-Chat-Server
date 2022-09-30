import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MapperService } from "src/modules/shared/mapper/mapper.service";
import { compareHash, generateHash } from "src/utils/hash-utils";
import { UserSecret } from "../user-secrets/entities/user-secret.entity";
import { UserSecretsService } from "../user-secrets/user-secrets.service";
import { UserDto } from "../users/dtos/user.dto";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { AdminPassResetRequest } from "./dtos/admin-pass-reset-request.dto";
import { AuthRequest } from "./dtos/auth-request.dto";
import { AuthResponse } from "./dtos/auth-response.dto";
import { PassResetRequest } from "./dtos/pass-reset-request.dto";
import appConfig from "src/app.config";

@Injectable()
export class AuthService {
  constructor(
    private _usersService: UsersService,
    private _secretsService: UserSecretsService,
    private _jwtService: JwtService,
    private _mapper: MapperService
  ) {}

  public async login(request: AuthRequest): Promise<AuthResponse> {
    let response: AuthResponse;

    try {
      const user: User = await this._usersService.getOne({
        where: { username: request.username },
        relations: ["organization"],
      });

      if (user == null) {
        throw "Login credentials are invalid";
      } else if (user.isLocked) {
        throw "Your account is locked. Please speak with your administrator.";
      }

      const password: UserSecret = await this._secretsService.getOneByUserId(
        user.id
      );
      if (
        password == null ||
        !(await compareHash(request.password, password.password))
      ) {
        throw "Login credentials are invalid";
      }

      user.isOnline = true;
      await this._usersService.update(user);

      const userDto: UserDto = this._mapper.users.mapDto(user);
      const jwtSecret: string = appConfig.jwtSecret;
      const jwt: string = this._jwtService.sign(
        { user: userDto },
        { secret: jwtSecret }
      );

      response = { isSuccess: true, user: userDto, token: jwt };
    } catch (error) {
      response = { isSuccess: false, message: error };
    }

    return response;
  }

  public async resetUserPassword(
    request: PassResetRequest | AdminPassResetRequest
  ): Promise<void> {
    const secret: UserSecret = await this._secretsService.getOneByUserId(
      request.userId
    );

    if (secret == null) {
      throw new NotFoundException(
        `Failed to reset password - User ID does not exist: ${request.userId}`
      );
    }
    if (
      request instanceof PassResetRequest &&
      !(await compareHash(request.currentPassword, secret.password))
    ) {
      throw new ConflictException("Current password is invalid");
    }
    if (!request.newPassword) {
      throw new BadRequestException("New password must have a value");
    }

    secret.password = await generateHash(request.newPassword, secret.salt);
    await this._secretsService.update(secret);
  }
}
