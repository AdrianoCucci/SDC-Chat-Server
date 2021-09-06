import { Server, Socket } from "socket.io";
import { Message } from "../../models/messages/message";
import { UserDto } from "../../models/users/user-dto";

export interface IChatController {
  onConnect(server: Server, socket: Socket): void;

  onDisconnect(reason: string): void;

  onUserJoin(user: UserDto): void;

  onUserLeave(user: UserDto): void;

  onMessage(message: Message): void;
}