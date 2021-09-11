import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { ROLES_META_KEY } from "src/decorators/roles.decorator";
import { Role } from "src/models/auth/role";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private _reflector: Reflector) { }

  public canActivate(context: ExecutionContext): boolean {
    let result: boolean = true;

    const requiredRoles: Role[] = this._reflector.getAllAndOverride(ROLES_META_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    const request: Request = context.switchToHttp().getRequest();
    console.log(request.headers);

    return result;
  }
}