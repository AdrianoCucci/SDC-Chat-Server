import { Server, Socket } from "socket.io";
import { IChatController } from "../controllers/interfaces/chat-controller";

export class SocketService {
  private readonly _server: Server;
  private readonly _chatController: IChatController;

  constructor(server: Server, chatController: IChatController) {
    this._server = server;
    this._chatController = chatController;

    this.configureCallbacks(this._server, this._chatController);
  }

  private configureCallbacks(server: Server, chatController: IChatController) {
    server.on("connection", (socket: Socket) => {
      chatController.onConnect(server, socket);

      socket.on("message", (message: string) => chatController.onMessage(message));

      socket.on("disconnect", (reason: string) => chatController.onDisconnect(reason));
    });
  }
}