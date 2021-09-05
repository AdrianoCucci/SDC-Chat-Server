import { Application } from "express";
import { IDbContext } from "../database/interfaces/db-context";
import { Message } from "../models/messages/message";
import { IApiController } from "./interfaces/api-controller";

export class MessagesController implements IApiController {
  private readonly _route: string = "/api/messages";

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
      try {
        const messageId: number = Number(request.params.id);
        const message: Message = await context.messages.getById(messageId);

        if(message == null) {
          throw `Message with ID does not exist: ${messageId}`;
        }

        Object.assign(message, request.body);

        context.messages.update(messageId, message);
        await context.messages.commit();

        response.status(200).json(message);
      }
      catch(error) {
        response.status(500).json({ error: error });
      }
    });

    // expressApp.delete(this._route, async (request, response) => {

    // });
  }
}