import { IChatController } from "./interfaces/chat-controller";
import { Server, Socket } from "socket.io";
import { ChatMessage } from "../models/messages/chat-message";
import { UserDto } from "../models/users/user-dto";
import { SOCKET_EVENTS } from "../utils/socket-events";
import { IDbContext } from "../database/interfaces/db-context";
import { MapperService } from "../services/mapper-service";
import { User } from "../models/users/user";

export class ChatController implements IChatController {
  private readonly _context: IDbContext;
  private readonly _mapper: MapperService;

  private _server: Server;
  private _socket: Socket;
  private _joinedUser: UserDto;

  constructor(context: IDbContext, mapper: MapperService) {
    this._context = context;
    this._mapper = mapper;
  }

  public onConnect(server: Server, socket: Socket): void {
    this._server = server;
    this._socket = socket;
  }

  public onDisconnect(reason: string): void {
    this.onUserLeave(this._joinedUser);
  }

  public async onUserJoin(user: UserDto): Promise<void> {
    const entity: User = await this._context.users.getById(user.userId);

    if(entity !== null) {
      entity.isOnline = true;
      this._context.users.update(entity.userId, entity);
      await this._context.users.commit();

      user = this._mapper.users.toDto(entity);
      this._socket.broadcast.emit(SOCKET_EVENTS.userJoin, user);
      this._joinedUser = user;
    }
  }

  public async onUserLeave(user: UserDto): Promise<void> {
    if(this._joinedUser != null && this._joinedUser.userId === user.userId) {
      const entity: User = await this._context.users.getById(user.userId);

      if(entity !== null) {
        entity.isOnline = false;
        this._context.users.update(entity.userId, entity);
        await this._context.users.commit();

        user = this._mapper.users.toDto(entity);
        this._socket.broadcast.emit(SOCKET_EVENTS.userLeave, user);

        this._joinedUser = null;
      }
    }
  }

  public async onMessage(message: ChatMessage): Promise<void> {
    if(message.senderUserId != null) {
      if(await this._context.users.hasEntity(message.senderUserId)) {
        this._context.messages.add(message);
        await this._context.messages.commit();

        this._socket.broadcast.emit(SOCKET_EVENTS.message, message);
      }
    }
  }
}