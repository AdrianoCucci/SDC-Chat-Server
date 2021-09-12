import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRequest } from 'src/models/auth/auth-request';
import { AuthResponse } from 'src/models/auth/auth-response';
import { User } from 'src/models/users/user';
import { UserResponse } from 'src/models/users/user-response';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { UsersService } from '../users/users.service';
import { Request } from 'express';
import appConfig from 'src/app.config';

@Injectable()
export class AuthService {
  constructor(private _usersService: UsersService, private _jwtService: JwtService, private _mapper: MapperService) { }

  public async login(request: AuthRequest): Promise<AuthResponse> {
    let response: AuthResponse;
    const user: User = await this._usersService.getByUsername(request.username);

    if(user == null || user.password !== request.password) {
      response = { isSuccess: false, message: "Login credentials are invalid" };
    }
    else {
      user.isOnline = true;
      await this._usersService.update(user);

      const userResponse: UserResponse = this._mapper.users.toResponse(user);
      const jwtSecret: string = appConfig().jwtSecret;
      const jwt: string = this._jwtService.sign({ user: userResponse }, { secret: jwtSecret });

      response = {
        isSuccess: true,
        user: userResponse,
        token: jwt
      };
    }

    return response;
  }

  public getRequestUser(request: Request): UserResponse {
    let user: UserResponse = null;

    if(request != null) {
      const header: string = request.header("authorization");

      if(header) {
        const token: string = header.replace("Bearer", "").trim();

        if(token) {
          const payload: any = this._jwtService.verify(token, { secret: appConfig().jwtSecret });

          if(payload) {
            user = payload.user;
          }
        }
      }
    }

    return user;
  }
}
