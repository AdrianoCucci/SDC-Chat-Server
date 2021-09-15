import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Role } from "src/models/auth/role";
import { UserDto } from "src/models/users/user-dto";
import { ROLES_META_KEY } from "src/decorators/roles.decorator";
import appConfig from "src/app.config";

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(private _jwtService: JwtService, private _reflector: Reflector) { }

  public canActivate(context: ExecutionContext): boolean {
    let result: boolean = false;

    const request: Request = context.switchToHttp().getRequest();
    const user: UserDto = this.getRequestUser(request);

    if(user != null) {
      request.user = user;
      result = this.validateRequiredRoles(user, context);
    }

    return result;
  }

  private getRequestUser(request: Request): UserDto {
    let user: UserDto = null;

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

  private validateRequiredRoles(user: UserDto, context: ExecutionContext): boolean {
    let isValid: boolean;
    const requiredRoles: Role[] = this._reflector.get<Role[]>(ROLES_META_KEY, context.getHandler());

    if(requiredRoles == null || requiredRoles.length === 0) {
      isValid = true;
    }
    else {
      isValid = requiredRoles.includes(user.role);
    }

    return isValid;
  }
}