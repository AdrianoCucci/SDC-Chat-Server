import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatMessageDto } from 'src/models/chat-messages/chat-message-dto';
import { User } from 'src/models/users/user';
import { UserDto } from 'src/models/users/user-dto';
import { UsersService } from '../users/users.service';
import { LiveChatService } from './services/live-chat.service';
import { SocketUsersService } from './services/socket-users.service';
import { SOCKET_EVENTS } from './utils/socket-events';
import { getUserRoom, broadcast } from './utils/socket-functions';

@WebSocketGateway({ cors: { origin: "*" } })
export class AppWebSocketGateway implements OnGatewayDisconnect {
  constructor(private _socketUsersService: SocketUsersService, private _usersService: UsersService, private _liveChatService: LiveChatService) { }

  public handleDisconnect(socket: Socket): void {
    const user: UserDto = this._socketUsersService.get(socket);

    if(user != null) {
      user.isOnline = false;
      socket.broadcast.emit(SOCKET_EVENTS.userLeave, user);

      this.updateUserOnline(user.id, false);
      this._socketUsersService.delete(socket);
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.userJoin)
  public onUserJoin(socket: Socket, payload: UserDto): void {
    this._socketUsersService.set(socket, payload);

    payload.isOnline = true;

    const room: string = getUserRoom(payload);
    if(room) {
      socket.join(room);
    }

    broadcast(socket, SOCKET_EVENTS.userJoin, payload, room);
    this.updateUserOnline(payload.id, true);
  }

  private async updateUserOnline(userId: number, isOnline: boolean): Promise<void> {
    const userEntity: User = await this._usersService.getById(userId);

    if(userEntity != null && userEntity.isOnline !== isOnline) {
      userEntity.isOnline = isOnline;
      await this._usersService.update(userEntity);
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.message)
  public onMessage(socket: Socket, payload: ChatMessageDto): void {
    this._liveChatService.onMessage(socket, payload);
  }
}