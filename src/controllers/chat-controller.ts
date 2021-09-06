import { IChatController } from "./interfaces/chat-controller";
import { Server, Socket } from "socket.io";
import { Message } from "../models/messages/message";
import { RoleType } from "../models/auth/role-type";
import { UserDto } from "../models/users/user-dto";
import { SOCKET_EVENTS } from "../utils/socket-events";

export class ChatController implements IChatController {
  private _server: Server;
  private _socket: Socket;

  public onConnect(server: Server, socket: Socket): void {
    console.log("New web socket connection...", socket);
    this._server = server;
    this._socket = socket;
  }

  public onDisconnect(reason: string): void {
    console.log("Socket disconnected...\nReason: ", reason);
  }

  public onUserJoin(user: UserDto): void {
    this._socket.broadcast.emit(SOCKET_EVENTS.userJoin, user);
  }

  public onUserLeave(user: UserDto): void {
    this._socket.broadcast.emit(SOCKET_EVENTS.userLeave, user);
  }

  public async onMessage(message: Message): Promise<void> {
    if(message.sender == null) {
      message.sender = {
        username: "[Unknown]",
        isOnline: true,
        role: RoleType.User
      }
    }

    console.log("MESSAGE:\n", message);
    this._socket.broadcast.emit(SOCKET_EVENTS.message, message);
  }
}