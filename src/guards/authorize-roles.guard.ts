import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ROLES_META_KEY } from "src/decorators/authorize-roles.decorator";
import { Role } from "src/models/auth/role";
import { UserResponse } from "src/models/users/user-response";
import appConfig from "src/app.config";

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
      result = this.validateAuthRole(request.header("authorization"), requiredRoles);
    }

    return result;
  }

  private validateAuthRole(authHeader: string, requiredRoles: Role[]): boolean {
    let authorized: boolean = false;

    if(authHeader != null) {
      const token: string = authHeader.replace("Bearer", "").trim();
      const payload: any = this._jwtService.verify(token, { secret: appConfig().jwtSecret });
      const role: Role = (payload.user as UserResponse).role;

      authorized = requiredRoles.includes(role);
    }

    return authorized;
  }
}