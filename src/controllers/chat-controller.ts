import { IChatController } from "./interfaces/chat-controller";
import { Server, Socket } from "socket.io";
import { Message } from "../models/messages/message";
import { IDbContext } from "../database/interfaces/db-context";
import { MapperService } from "../services/mapper-service";
import { User } from "../models/users/user";

export class ChatController implements IChatController {
  private readonly _context: IDbContext;
  private readonly _mapper: MapperService;

  private _server: Server;
  private _socket: Socket;

  constructor(context: IDbContext, mapper: MapperService) {
    this._context = context;
    this._mapper = mapper;
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
    const user: User = await this._context.users.getById(message.senderUserId);
    message.sender = this._mapper.users.toDto(user);

    console.log("MESSAGE:\n", message);
    this._socket.broadcast.emit("message", message);
  }
}