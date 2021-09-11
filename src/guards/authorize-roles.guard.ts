import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ROLES_META_KEY } from "src/decorators/authorize-roles.decorator";
import { Role } from "src/models/auth/role";
import { UserResponse } from "src/models/users/user-response";
import appConfig from "src/app.config";
import { parseAuthToken } from "src/utils/parse-auth-header";

@Injectable()
export class AuthorizeRolesGuard implements CanActivate {
  constructor(private _reflector: Reflector, private _jwtService: JwtService) { }

  public canActivate(context: ExecutionContext): boolean {
    let result: boolean = true;

    const requiredRoles: Role[] = this._reflector.getAllAndOverride(ROLES_META_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if(requiredRoles?.length > 0 ?? false) {
      const request: Request = context.switchToHttp().getRequest();
      const token: string = parseAuthToken(request);
      result = this.validateAuthRole(token, requiredRoles);
    }

    return result;
  }

  private validateAuthRole(authToken: string, requiredRoles: Role[]) {
    let authorized: boolean = false;

    if(authToken) {
      const payload: any = this._jwtService.verify(authToken, { secret: appConfig().jwtSecret });

      if(payload) {
        const role: Role = (payload.user as UserResponse).role;
        authorized = requiredRoles.includes(role);
      }
    }

    return authorized;
  }
}