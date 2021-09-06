import { Response } from "express";
import { ApiControllerError } from "./api-controller-error";

export const handleApiControllerError = (error: any, response: Response) => {
  if(error instanceof ApiControllerError) {
    response.status(error.status).send(error.response);
  }
  else {
    response.status(500).send(error);
  }
}