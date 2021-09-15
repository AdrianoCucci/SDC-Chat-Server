import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRequest } from 'src/models/auth/auth-request';
import { AuthResponse } from 'src/models/auth/auth-response';
import { User } from 'src/models/users/user';
import { UserDto } from 'src/models/users/user-dto';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { UsersService } from '../users/users.service';
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

      const userDto: UserDto = this._mapper.users.mapResponse(user);
      const jwtSecret: string = appConfig().jwtSecret;
      const jwt: string = this._jwtService.sign({ user: userDto }, { secret: jwtSecret });

      response = {
        isSuccess: true,
        user: userDto,
        token: jwt
      };
    }

    return response;
  }
}
