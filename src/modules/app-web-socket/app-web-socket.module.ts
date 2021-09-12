import { Module } from '@nestjs/common';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { ChatMessagesService } from '../chat-messages/chat-messages.service';
import { UsersService } from '../users/users.service';
import { AppWebSocketGateway } from './app-web-socket.gateway';

@Module({
  providers: [
    AppWebSocketGateway,
    ChatMessagesService,
    UsersService,
    MapperService
  ]
})
export class AppWebSocketModule { }