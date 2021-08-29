import { Application } from "express";
import { IDbContext } from "../../database/interfaces/db-context";

export interface IApiController {
  configure(expressApp: Application, context: IDbContext): void;
}