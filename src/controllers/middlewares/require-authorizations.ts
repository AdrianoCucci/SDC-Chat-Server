import { Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { ExpressAuthRequest } from "../../models/auth/express-auth-request";
import { RoleType } from "../../models/auth/role-type";

export const requireAuth = (request: ExpressAuthRequest, response: Response, next: NextFunction) => {
  const authHeader: string = request.headers["authorization"];
  const token: string = authHeader?.replace(/[Bb]earer\s*/, '') ?? null;

  if(token == null) {
    response.sendStatus(403);
  }
  else {
    const secret: string = process.env.TOKEN_SECRET;

    verify(token, secret, (error: any, payload: any) => {
      if(error) {
        response.sendStatus(403);
      }
      else {
        request.user = payload;
        next();
      }
    });
  }
}

export const requireAdministrator = (request: ExpressAuthRequest, response: Response, next: NextFunction) => {
  requireAuth(request, response, () => {
    const userRole: RoleType = request.user?.role ?? null;

    if(userRole !== RoleType.Administrator) {
      response.sendStatus(403);
    }
    else {
      next();
    }
  });
}