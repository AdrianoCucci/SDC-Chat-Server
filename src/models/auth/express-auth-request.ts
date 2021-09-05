import { Request } from "express";
import { User } from "../users/user";

export interface ExpressAuthRequest extends Request {
  user?: User;
}