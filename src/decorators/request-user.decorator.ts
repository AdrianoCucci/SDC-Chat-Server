import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const RequestUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    return request.user;
  }
);