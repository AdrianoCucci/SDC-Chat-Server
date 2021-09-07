import { Application } from "express";
import { IDbContext } from "../../database/interfaces/db-context";
import { ChatMessage } from "../../models/messages/chat-message";
import { ApiControllerError } from "../../utils/api-controller-error";
import { handleApiControllerError } from "../../utils/handle-api-controller-error";
import { requireAuth } from "../../utils/request-authorizations";
import { IApiController } from "../interfaces/api-controller";

export class ChatMessagesController implements IApiController {
  private readonly _route: string = "/api/chat-messages";
  private readonly _context: IDbContext;

  public constructor(context: IDbContext) {
    this._context = context;
  }

  public configure(expressApp: Application) {
    expressApp.get(this._route, requireAuth, async (request, response) => {
      const messages: ChatMessage[] = await this._context.messages.getAll();
      
      for (let i = 0; i < messages.length; i++) {
        messages[i].sender = await this._context.users.getById(messages[i].senderUserId);
      }

      response.status(200).json(messages);
    });

    expressApp.post(this._route, requireAuth, async (request, response) => {
      const message: ChatMessage = request.body;

      this._context.messages.add(message);
      await this._context.messages.commit();

      response.status(201).json(message);
    });

    expressApp.put(`${this._route}/:id`, requireAuth, async (request, response) => {
      try {
        const messageId: number = Number(request.params.id);
        const message: ChatMessage = await this._context.messages.getById(messageId);

        if(message == null) {
          throw new ApiControllerError(404, `Message with ID does not exist: ${messageId}`);
        }

        Object.assign(message, request.body);

        this._context.messages.update(messageId, message);
        await this._context.messages.commit();

        response.status(200).json(message);
      }
      catch(error) {
        handleApiControllerError(error, response);
      }
    });

    expressApp.delete(`${this._route}/:id`, requireAuth, async (request, response) => {
      try {
        const messageId: number = Number(request.params.id);
        const messageExists: boolean = await this._context.messages.hasEntity(messageId);

        if(!messageExists) {
          throw new ApiControllerError(404, `Message with ID does not exist: ${messageId}`);
        }

        this._context.messages.delete(messageId);
        await this._context.messages.commit();

        response.status(200).send("Message deleted successfully");
      }
      catch(error) {
        handleApiControllerError(error, response);
      }
    });
  }
}