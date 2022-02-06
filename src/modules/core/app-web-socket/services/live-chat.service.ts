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

  public async onMessage(socket: Socket, payload: ChatMessageDto): Promise<ChatMessageDto> {
    if(payload != null && payload.contents && payload.senderUserId != null) {
      const user: UserDto = this._socketUsersService.get(socket);

      if(user != null && await this._usersService.hasAnyWithId(payload.senderUserId)) {
        let entity: ChatMessage = this._mapper.chatMessages.mapEntity(payload);
        entity = await this._messagesService.add(entity);

        payload = this._mapper.chatMessages.mapDto(entity);
        const room: string = getUserRoom(user);
        broadcast(socket, SOCKET_EVENTS.message, payload, room);
      }
    }

    return payload;
  }

  public async onMessageEdit(socket: Socket, payload: ChatMessageDto): Promise<ChatMessageDto> {
    if(payload?.id != null && payload.contents && payload.senderUserId != null) {
      const user: UserDto = this._socketUsersService.get(socket);

      if(user != null && await this._messagesService.hasAnyWithId(payload.id)) {
        let entity: ChatMessage = this._mapper.chatMessages.mapEntity(payload);
        entity = await this._messagesService.update(entity);

        payload = this._mapper.chatMessages.mapDto(entity);
        const room: string = getUserRoom(user);
        broadcast(socket, SOCKET_EVENTS.messageEdit, payload, room);
      }
    }

    return payload;
  }

  public async onMessageDelete(socket: Socket, payload: ChatMessageDto): Promise<void> {
    if(payload?.id != null) {
      const user: UserDto = this._socketUsersService.get(socket);

      if(user != null) {
        const entity: ChatMessage = await this._messagesService.getOneById(payload.id);

        if(entity != null) {
          await this._messagesService.delete(entity);

          const room: string = getUserRoom(user);
          broadcast(socket, SOCKET_EVENTS.messageDelete, payload, room);
        }
      }
    }
  }
}
