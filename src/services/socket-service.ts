import { Server, Socket } from "socket.io";
import { ChatController } from "../controllers/chat-controller";
import { IChatController } from "../controllers/interfaces/chat-controller";
import { Message } from "../models/messages/message";
import { UserDto } from "../models/users/user-dto";
import { SOCKET_EVENTS } from "../utils/socket-events";

export class SocketService {
  private readonly _server: Server;
  private readonly _chatControllers: IChatController[];

  constructor(server: Server) {
    this._server = server;
    this._chatControllers = [];

    this.configureCallbacks(this._server);
  }

  private configureCallbacks(server: Server) {
    server.on(SOCKET_EVENTS.connect, (socket: Socket) => {
      const chatController: IChatController = new ChatController();

      socket.on(SOCKET_EVENTS.userJoin, (user: UserDto) => chatController.onUserJoin(user));
      socket.on(SOCKET_EVENTS.userLeave, (user: UserDto) => chatController.onUserLeave(user));
      socket.on(SOCKET_EVENTS.message, (message: Message) => chatController.onMessage(message));

      socket.on(SOCKET_EVENTS.disconnect, (reason: string) => {
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