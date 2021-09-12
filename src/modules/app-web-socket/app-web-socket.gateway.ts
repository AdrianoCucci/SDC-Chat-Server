import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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

  public async handleDisconnect(socket: Socket): Promise<void> {
    const user: UserResponse = this._socketUserMap.get(socket);

    if(user != null) {
      const userId: number = user.id;
      user.isOnline = false;

      console.log("USER LEAVE", user);
      socket.broadcast.emit(SOCKET_EVENTS.userLeave, user);

      this._socketUserMap.delete(socket);
      await this.updateDisconnectedUser(userId);
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.userJoin)
  public async onUserJoin(socket: Socket, payload: UserResponse): Promise<void> {
    payload.isOnline = true;

    this._socketUserMap.set(socket, payload);
    console.log("USER JOIN", payload);
    socket.broadcast.emit(SOCKET_EVENTS.userJoin, payload);

    await this.updateConnectedUser(payload.id);
  }

  private async updateConnectedUser(userId: number): Promise<void> {
    const userEntity: User = await this._usersService.getById(userId);

    if(userEntity != null) {
      userEntity.isOnline = true;
      await this._usersService.update(userEntity);

      console.log("UPDATED USER ENTITY");
    }
  }

  private async updateDisconnectedUser(userId: number): Promise<void> {
    const userEntity: User = await this._usersService.getById(userId);

    if(userEntity != null) {
      userEntity.isOnline = false;
      await this._usersService.update(userEntity);

      console.log("UPDATED USER ENTITY");
    }
  }
}
