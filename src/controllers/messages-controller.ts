import { Application } from "express";
import { IDbContext } from "../database/interfaces/db-context";
import { Message } from "../models/messages/message";
import { IApiController } from "./interfaces/api-controller";

export class MessagesController implements IApiController {
  private readonly _route: string = "/messages";

  public configure(expressApp: Application, context: IDbContext) {
    expressApp.get(this._route, async (request, response) => {
      const messages: Message[] = await context.messages.getAll();
      response.status(200).json(messages);
    });

    expressApp.post(this._route, async (request, response) => {
      const message: Message = request.body;

      context.messages.add(message);
      await context.messages.commit();

      response.status(201).json(message);
    });

    expressApp.put(`${this._route}/:id`, async (request, response) => {
      const messageId: number = Number(request.params.id);
      const message: Message = request.body;

      context.messages.update(message, messageId);
      await context.messages.commit();

      response.status(200).json(message);
    });

    expressApp.delete(this._route, async (request, response) => {

    });
  }
}