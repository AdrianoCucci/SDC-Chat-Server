import { Server, Socket } from "socket.io";
import { ChatMessage } from "../../models/messages/chat-message";
import { UserDto } from "../../models/users/user-dto";

export interface IChatController {
  onConnect(server: Server, socket: Socket): void;

  onDisconnect(reason: string): void;

  onUserJoin(user: UserDto): void;

  onUserLeave(user: UserDto): void;

  onMessage(message: ChatMessage): void;
}