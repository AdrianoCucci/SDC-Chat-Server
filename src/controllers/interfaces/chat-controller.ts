import { Server, Socket } from "socket.io";
import { Message } from "../../models/messages/message";

export interface IChatController {
  onConnect(server: Server, socket: Socket): void;

  onDisconnect(reason: string): void;

  onMessage(message: Message): void;
}