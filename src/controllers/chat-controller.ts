import { IChatController } from "./interfaces/chat-controller";
import { Server, Socket } from "socket.io";
import { Message } from "../models/messages/message";
import { RoleType } from "../models/auth/role-type";
import { UserDto } from "../models/users/user-dto";
import { SOCKET_EVENTS } from "../utils/socket-events";

export class ChatController implements IChatController {
  private _server: Server;
  private _socket: Socket;

  private readonly _joinedUsers: UserDto[] = [];

  public onConnect(server: Server, socket: Socket): void {
    this._server = server;
    this._socket = socket;
  }

  public onDisconnect(reason: string): void {
    for(let i = 0; i < this._joinedUsers.length; i++) {
      this.onUserLeave(this._joinedUsers[i]);
    }
  }

  public onUserJoin(user: UserDto): void {
    this._socket.broadcast.emit(SOCKET_EVENTS.userJoin, user);
    this._joinedUsers.push(user);
  }

  public onUserLeave(user: UserDto): void {
    this._socket.broadcast.emit(SOCKET_EVENTS.userLeave, user);

    const userIndex: number = this._joinedUsers.indexOf(user);
    if(userIndex !== -1) {
      this._joinedUsers.splice(userIndex, 1);
    }
  }

  public async onMessage(message: Message): Promise<void> {
    if(message.sender == null) {
      message.sender = {
        username: "[Unknown]",
        role: RoleType.User
      }
    }

    this._socket.broadcast.emit(SOCKET_EVENTS.message, message);
  }
}