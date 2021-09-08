import { Response, NextFunction, Request } from "express";

export const requireBody = (request: Request, response: Response, next: NextFunction) => {
  if(request.body == null) {
    response.status(400).send("Request body is missing");
  }
  else {
    next();
  }
}