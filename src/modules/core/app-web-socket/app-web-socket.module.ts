import { Module } from '@nestjs/common';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { ChatMessagesModule } from '../chat-messages/chat-messages.module';
import { UsersService } from '../users/users.service';
import { AppWebSocketGateway } from './app-web-socket.gateway';

@Module({
  imports: [ChatMessagesModule],
  providers: [
    AppWebSocketGateway,
    UsersService,
    MapperService
  ]
})
export class AppWebSocketModule { }