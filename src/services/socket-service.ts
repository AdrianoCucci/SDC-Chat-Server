import { Server, Socket } from "socket.io";
import { ChatController } from "../controllers/chat-controller";
import { IChatController } from "../controllers/interfaces/chat-controller";
import { IDbContext } from "../database/interfaces/db-context";
import { Message } from "../models/messages/message";

export class SocketService {
  private readonly _server: Server;
  private readonly _context: IDbContext;
  private readonly _chatControllers: IChatController[];

  constructor(server: Server, context: IDbContext) {
    this._server = server;
    this._context = context;
    this._chatControllers = [];

    this.configureCallbacks(this._server);
  }

  private configureCallbacks(server: Server) {
    server.on("connection", (socket: Socket) => {
      const chatController: IChatController = new ChatController(this._context);

      socket.on("message", (message: Message) => chatController.onMessage(message));

      socket.on("disconnect", (reason: string) => {
        chatController.onDisconnect(reason);

        const index: number = this._chatControllers.indexOf(chatController);
        if(index !== -1) {
          this._chatControllers.splice(index, 1);
        }
      });

      this._chatControllers.push(chatController);
      chatController.onConnect(server, socket);
    });
  }
}