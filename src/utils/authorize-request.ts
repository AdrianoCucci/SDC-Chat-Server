import { Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { ExpressAuthRequest } from "../models/auth/express-auth-request";

export const authorizeRequest = (request: ExpressAuthRequest, response: Response, next: NextFunction) => {
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