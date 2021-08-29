import { Server, Socket } from "socket.io";

export interface IChatController {
  onConnect(server: Server, socket: Socket): void;

  onDisconnect(reason: string): void;

  onMessage(message: string): void;
}