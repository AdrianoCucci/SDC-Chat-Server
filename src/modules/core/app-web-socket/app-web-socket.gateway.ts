import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatMessageDto } from '../chat-messages/dtos/chat-message.dto';
import { UserDto } from '../users/dtos/user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { RoomPing } from './dtos/room-ping.dto';
import { LiveChatService } from './services/live-chat.service';
import { RoomPingsService } from './services/room-pings.service';
import { SocketUsersService } from './services/socket-users.service';
import { SOCKET_EVENTS } from './utils/socket-events';
import { getUserRoom, broadcast } from './utils/socket-functions';

import appConfig from 'src/app.config';

@WebSocketGateway({ cors: appConfig.cors, path: appConfig.socketPath })
export class AppWebSocketGateway implements OnGatewayDisconnect {
  constructor(
    private _socketUsersService: SocketUsersService,
    private _usersService: UsersService,
    private _liveChatService: LiveChatService,
    private _roomPingsService: RoomPingsService
  ) { }

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
  public onUserJoin(socket: Socket, payload: UserDto): UserDto {
    this._socketUsersService.set(socket, payload);

    payload.isOnline = true;

    const room: string = getUserRoom(payload);
    if(room) {
      socket.join(room);
    }

    broadcast(socket, SOCKET_EVENTS.userJoin, payload, room);
    this.updateUserOnline(payload.id, true);

    return payload;
  }

  private async updateUserOnline(userId: number, isOnline: boolean): Promise<void> {
    const userEntity: User = await this._usersService.getOneById(userId);

    if(userEntity != null && userEntity.isOnline !== isOnline) {
      userEntity.isOnline = isOnline;
      await this._usersService.update(userEntity);
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.message)
  public onMessage(socket: Socket, payload: ChatMessageDto): void {
    this._liveChatService.onMessage(socket, payload);
  }

  @SubscribeMessage(SOCKET_EVENTS.messageEdit)
  public onMessageEdit(socket: Socket, payload: ChatMessageDto): void {
    this._liveChatService.onMessageEdit(socket, payload);
  }

  @SubscribeMessage(SOCKET_EVENTS.messageDelete)
  public onMessageDelete(socket: Socket, payload: ChatMessageDto): void {
    this._liveChatService.onMessageDelete(socket, payload);
  }

  @SubscribeMessage(SOCKET_EVENTS.roomPingRequest)
  public onRoomPingRequest(socket: Socket, payload: RoomPing): RoomPing {
    return this._roomPingsService.onRoomPingRequest(socket, payload);
  }

  @SubscribeMessage(SOCKET_EVENTS.roomPingResponse)
  public onRoomPingResponse(socket: Socket, payload: RoomPing): RoomPing {
    return this._roomPingsService.onRoomPingResponse(socket, payload);
  }

  @SubscribeMessage(SOCKET_EVENTS.roomPingCancel)
  public onRoomPingCancel(socket: Socket, payload: RoomPing): void {
    this._roomPingsService.onRoomPingCancel(socket, payload);
  }

  @SubscribeMessage(SOCKET_EVENTS.getRoomPings)
  public onGetRequestingRoomPings(socket: Socket): RoomPing[] {
    return this._roomPingsService.onGetRequestingPings(socket);
  }
}