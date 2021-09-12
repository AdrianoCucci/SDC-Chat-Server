import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessage } from 'src/models/chat-messages/chat-message';
import { User } from 'src/models/users/user';
import { UserResponse } from 'src/models/users/user-response';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { ChatMessagesService } from '../chat-messages/chat-messages.service';
import { UsersService } from '../users/users.service';
import { SOCKET_EVENTS } from './socket-events';

@WebSocketGateway({ cors: { origin: "*" } })
export class AppWebSocketGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  private readonly _server: Server;

  private readonly _socketUserMap = new Map<Socket, UserResponse>();

  constructor(private _messagesService: ChatMessagesService, private _usersService: UsersService, private _mapper: MapperService) { }

  public handleDisconnect(socket: Socket): void {
    const user: UserResponse = this._socketUserMap.get(socket);

    if(user != null) {
      user.isOnline = false;
      socket.broadcast.emit(SOCKET_EVENTS.userLeave, user);

      this.updateUserOnline(user.id, false);
      this._socketUserMap.delete(socket);
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.userJoin)
  public onUserJoin(socket: Socket, payload: UserResponse): void {
    this._socketUserMap.set(socket, payload);

    payload.isOnline = true;
    socket.broadcast.emit(SOCKET_EVENTS.userJoin, payload);

    this.updateUserOnline(payload.id, true);
  }

  @SubscribeMessage(SOCKET_EVENTS.message)
  public async onMessage(socket: Socket, payload: ChatMessage): Promise<void> {
    if(payload != null && payload.contents && payload.senderUserId != null) {
      socket.broadcast.emit(SOCKET_EVENTS.message, payload);

      if(await this._usersService.idExists(payload.senderUserId)) {
        await this._messagesService.add(payload);
      }
    }
  }

  private async updateUserOnline(userId: number, isOnline: boolean): Promise<void> {
    const userEntity: User = await this._usersService.getById(userId);

    if(userEntity != null) {
      userEntity.isOnline = isOnline;
      await this._usersService.update(userEntity);
    }
  }
}
