import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { ROLES_META_KEY } from "src/decorators/authorize-roles.decorator";
import { Role } from "src/models/auth/role";
import { UserResponse } from "src/models/users/user-response";
import { AuthService } from "src/modules/auth/auth.service";

@Injectable()
export class AuthorizeRolesGuard implements CanActivate {
  constructor(private _authService: AuthService, private _reflector: Reflector) { }

  public canActivate(context: ExecutionContext): boolean {
    let result: boolean = true;

    const requiredRoles: Role[] = this._reflector.getAllAndOverride(ROLES_META_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if(requiredRoles?.length > 0 ?? false) {
      const request: Request = context.switchToHttp().getRequest();
      const user: UserResponse = this._authService.getRequestUser(request);

      result = requiredRoles.includes(user.role);
    }

    return result;
  }
}