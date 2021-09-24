import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatMessage } from 'src/models/chat-messages/chat-message';
import { ChatMessageDto } from 'src/models/chat-messages/chat-message-dto';
import { UserDto } from 'src/models/users/user-dto';
import { MapperService } from 'src/modules/shared/mapper/mapper.service';
import { ChatMessagesService } from '../../chat-messages/chat-messages.service';
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

        if(await this._usersService.idExists(payload.senderUserId)) {
          const entity: ChatMessage = this._mapper.chatMessages.mapEntity(payload);
          await this._messagesService.add(entity);
        }
      }
    }
  }
}