import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { MapperService } from 'src/modules/shared/mapper/mapper.service';
import { ChatMessagesService } from '../../chat-messages/chat-messages.service';
import { ChatMessageDto } from '../../chat-messages/dtos/chat-message.dto';
import { ChatMessage } from '../../chat-messages/entities/chat-message.entity';
import { UserDto } from '../../users/dtos/user.dto';
import { UsersService } from '../../users/users.service';
import { SOCKET_EVENTS } from '../utils/socket-events';
import { getUserRoom, broadcast } from '../utils/socket-functions';
import { SocketUsersService } from './socket-users.service';

@Injectable()
export class LiveChatService {
  constructor(
    private _socketUsersService: SocketUsersService,
    private _messagesService: ChatMessagesService,
    private _usersService: UsersService,
    private _mapper: MapperService
  ) { }

  public async onMessage(socket: Socket, payload: ChatMessageDto): Promise<void> {
    if(payload != null && payload.contents && payload.senderUserId != null) {
      const user: UserDto = this._socketUsersService.get(socket);

      if(user != null) {
        const room: string = getUserRoom(user);
        broadcast(socket, SOCKET_EVENTS.message, payload, room);

        if(await this._usersService.hasAnyWithId(payload.senderUserId)) {
          const entity: ChatMessage = this._mapper.chatMessages.mapEntity(payload);
          await this._messagesService.add(entity);
        }
      }
    }
  }

  public async onMessageEdit(socket: Socket, payload: ChatMessageDto): Promise<void> {
    if(payload?.id != null && payload.contents && payload.senderUserId != null) {
      const user: UserDto = this._socketUsersService.get(socket);

      if(user != null) {
        const room: string = getUserRoom(user);
        broadcast(socket, SOCKET_EVENTS.messageEdit, payload, room);

        if(await this._messagesService.idExists(payload.id)) {
          const entity: ChatMessage = this._mapper.chatMessages.mapEntity(payload);
          await this._messagesService.update(entity);
        }
      }
    }
  }

  public async onMessageDelete(socket: Socket, payload: ChatMessageDto): Promise<void> {
    if(payload?.id != null) {
      const user: UserDto = this._socketUsersService.get(socket);

      if(user != null) {
        const room: string = getUserRoom(user);
        broadcast(socket, SOCKET_EVENTS.messageDelete, payload, room);

        await this._messagesService.delete(payload.id);
      }
    }
  }
}
