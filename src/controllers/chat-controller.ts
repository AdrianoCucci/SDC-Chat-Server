import { IChatController } from "./interfaces/chat-controller";
import { Server, Socket } from "socket.io";
import { Message } from "../models/messages/message";
import { IDbContext } from "../database/interfaces/db-context";

export class ChatController implements IChatController {
  private readonly _context: IDbContext;

  private _server: Server;
  private _socket: Socket;

  constructor(context: IDbContext) {
    this._context = context;
  }

  public onConnect(server: Server, socket: Socket): void {
    console.log("New web socket connection...");
    this._server = server;
    this._socket = socket;
  }

  public onDisconnect(reason: string): void {
    console.log("Socket disconnected...\nReason: ", reason);
  }

  public async onMessage(message: Message): Promise<void> {
    message.sender = await this._context.users.getById(message.senderUserId);

    console.log("MESSAGE:\n", message);
    this._socket.broadcast.emit("message", message);
  }
}