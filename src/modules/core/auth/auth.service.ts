import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRequest } from 'src/models/auth/auth-request';
import { AuthResponse } from 'src/models/auth/auth-response';
import { User } from 'src/models/users/user';
import { UserDto } from 'src/models/users/user-dto';
import { MapperService } from 'src/modules/shared/mapper/mapper.service';
import { UsersService } from '../users/users.service';
import { UserPasswordsService } from './user-passwords.service';
import { UserPassword } from 'src/models/auth/user-password';
import { PassResetRequest } from 'src/models/auth/pass-reset-request';
import { AdminPassResetRequest } from 'src/models/auth/admin-pass-reset-request';
import appConfig from 'src/app.config';

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

  public async resetUserPassword(request: PassResetRequest | AdminPassResetRequest): Promise<void> {
    const password: UserPassword = await this._passwordsService.getByUserId(request.userId);

    if(password == null) {
      throw new NotFoundException(`Failed to reset password - User ID does not exist: ${request.userId}`);
    }
    if(request instanceof PassResetRequest && password.value !== request.currentPassword) {
      throw new ConflictException("Current password is invalid");
    }
    if(!request.newPassword) {
      throw new BadRequestException("New password must have a value");
    }

    password.value = request.newPassword;
    await this._passwordsService.update(password);
  }
}