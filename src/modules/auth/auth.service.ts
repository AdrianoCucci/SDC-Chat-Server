import { Injectable } from '@nestjs/common';
import { AuthRequest } from 'src/models/auth/auth-request';
import { AuthResponse } from 'src/models/auth/auth-response';
import { User } from 'src/models/users/user';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private _usersService: UsersService, private _mapper: MapperService) { }

  public async login(request: AuthRequest): Promise<AuthResponse> {
    let response: AuthResponse;
    const user: User = await this._usersService.getByUsername(request.username);

    if(user == null || user.password !== request.password) {
      response = { isSuccess: false, message: "Login credentials are invalid" };
    }
    else {
      user.isOnline = true;
      await this._usersService.update(user.id, user);

      response = {
        isSuccess: true,
        user: this._mapper.users.toResponse(user),
        token: "ABC123"
      };
    }

    return response;
  }
}
