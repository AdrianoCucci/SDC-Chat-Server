import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { AuthRequest } from 'src/models/auth/auth-request';
import { AuthResponse } from 'src/models/auth/auth-response';
import { AuthService } from './auth.service';

@Controller("api/auth")
export class AuthController {
  constructor(private _authService: AuthService) { }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  public async login(@Body() request: AuthRequest): Promise<AuthResponse> {
    const response: AuthResponse = await this._authService.login(request);
    
    if(!response.isSuccess) {
      throw new UnauthorizedException(response.message);
    }

    return response;
  }
}
