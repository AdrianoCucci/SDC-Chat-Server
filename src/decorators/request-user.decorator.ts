import { createParamDecorator, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Request } from "express";
import { UserDto } from "src/modules/core/users/dtos/user.dto";

export const RequestUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as UserDto;

    if(user == null) {
      throw new ForbiddenException();
    }

    return user;
  }
);