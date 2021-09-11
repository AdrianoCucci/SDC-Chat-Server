import { Request } from "express";

export const parseAuthToken = (request: Request): string => {
  let token: string = null;

  if(request != null) {
    const header: string = request.header("authorization");

    if(header) {
      token = header.replace("Bearer", "").trim();
    }
  }

  return token;
}