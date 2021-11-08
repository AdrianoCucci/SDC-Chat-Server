import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRequest } from 'src/models/auth/auth-request';
import { AuthResponse } from 'src/models/auth/auth-response';
import { User } from 'src/models/users/user';
import { UserDto } from 'src/models/users/user-dto';
import { MapperService } from 'src/modules/shared/mapper/mapper.service';
import { UsersService } from '../users/users.service';
import appConfig from 'src/app.config';
import { UserPasswordsService } from './user-passwords.service';
import { UserPassword } from 'src/models/auth/user-password';

@Injectable()
export class AuthService {
  constructor(
    private _usersService: UsersService,
    private _passwordsService: UserPasswordsService,
    private _jwtService: JwtService,
    private _mapper: MapperService
  ) { }

  public async login(request: AuthRequest): Promise<AuthResponse> {
    let response: AuthResponse;

    try {
      const user: User = await this._usersService.getByUsername(request.username);
      if(user == null) {
        throw "Login credentials are invalid";
      }
      else if(user.isLocked) {
        throw "Your account is locked. Please speak with your administrator.";
      }

      const password: UserPassword = await this._passwordsService.getByUserId(user.id);
      if(password == null || password.value !== request.password) {
        throw "Login credentials are invalid";
      }

      user.isOnline = true;
      await this._usersService.update(user);

      const userDto: UserDto = this._mapper.users.mapDto(user);
      const jwtSecret: string = appConfig().jwtSecret;
      const jwt: string = this._jwtService.sign({ user: userDto }, { secret: jwtSecret });

      response = { isSuccess: true, user: userDto, token: jwt };
    }
    catch(error) {
      response = { isSuccess: false, message: error };
    }

    return response;
  }
}
