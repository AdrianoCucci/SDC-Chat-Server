import { IChatController } from "./interfaces/chat-controller";
import { Server, Socket } from "socket.io";

export class ChatController implements IChatController {
  private _server: Server = null;

  onConnect(server: Server, socket: Socket): void {
    this._server = server;
    console.log("New web socket connection...");
  }

  onDisconnect(reason: string): void {
    console.log("Socket disconnected...\nReason: ", reason)
  }

  onMessage(message: string): void {
    console.log("MESSAGE:\n", message);
    this._server.send(message);
  }
}