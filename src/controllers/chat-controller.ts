import { IChatController } from "./interfaces/chat-controller";
import { Server, Socket } from "socket.io";
import { Message } from "../models/messages/message";

export class ChatController implements IChatController {
  private readonly _server: Server;
  private readonly _socket: Socket;

  constructor(server: Server, socket: Socket) {
    this._server = server;
    this._socket = socket;
  }

  onConnect(): void {
    console.log("New web socket connection...");
  }

  onDisconnect(reason: string): void {
    console.log("Socket disconnected...\nReason: ", reason);
  }

  onMessage(message: Message): void {
    console.log("MESSAGE:\n", message);
    this._socket.broadcast.emit("message", message);
  }
}