import { Application } from "express";

export interface IApiController {
  configure(expressApp: Application): void;
}