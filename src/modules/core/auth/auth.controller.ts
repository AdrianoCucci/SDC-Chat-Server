import { Controller, UseInterceptors, ClassSerializerInterceptor, Post, HttpCode, HttpStatus, Body, UnauthorizedException, UseGuards, ForbiddenException, NotFoundException } from "@nestjs/common";
import { RequestUser } from "src/decorators/request-user.decorator";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/models/auth/role";
import { AuthorizeGuard } from "src/modules/shared/jwt-auth/authorize.guard";
import { UserDto } from "../users/dtos/user.dto";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { AdminPassResetRequest } from "./dtos/admin-pass-reset-request.dto";
import { AuthRequest } from "./dtos/auth-request.dto";
import { AuthResponse } from "./dtos/auth-response.dto";
import { PassResetRequest } from "./dtos/pass-reset-request.dto";

@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private _authService: AuthService, private _usersService: UsersService) { }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  public async login(@Body() request: AuthRequest): Promise<AuthResponse> {
    const response: AuthResponse = await this._authService.login(request);

    if(!response.isSuccess) {
      throw new UnauthorizedException(response.message);
    }

    return response;
  }

  @Post("reset-password")
  @UseGuards(AuthorizeGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async resetPassword(@RequestUser() requestUser: UserDto, @Body() request: PassResetRequest): Promise<void> {
    const targetUser: User = await this.tryGetUserById(request.userId);

    if(requestUser.id !== targetUser.id) {
      throw new ForbiddenException("You do not have permission to reset this user's password");
    }

    await this._authService.resetUserPassword(request);
  }

  @Post("admin-reset-password")
  @UseGuards(AuthorizeGuard)
  @Roles(Role.Administrator, Role.OrganizationAdmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async adminResetPassword(@RequestUser() requestUser: UserDto, @Body() request: AdminPassResetRequest): Promise<void> {
    const targetUser: User = await this.tryGetUserById(request.userId);

    if(requestUser.role === Role.OrganizationAdmin) {
      if(targetUser.organizationId !== requestUser.organizationId || targetUser.role !== Role.User) {
        throw new ForbiddenException("You do not have permission to reset this user's password");
      }

      await this._authService.resetUserPassword(request);
    }
    else if(targetUser.role === Role.Administrator) {
      throw new ForbiddenException("You may not reset an administrator's password");
    }

    await this._authService.resetUserPassword(request);
  }

  private async tryGetUserById(id: number): Promise<User> {
    const user: User = await this._usersService.getOneById(id);

    if(user == null) {
      throw new NotFoundException(`User ID does not exist: ${id}`);
    }

    return user;
  }
}
