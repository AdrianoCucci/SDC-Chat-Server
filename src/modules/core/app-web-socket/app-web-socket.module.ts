import { Module } from '@nestjs/common';
import { ChatMessagesModule } from '../chat-messages/chat-messages.module';
import { UsersModule } from '../users/users.module';
import { MapperModule } from 'src/modules/shared/mapper/mapper.module';
import { AppWebSocketGateway } from './app-web-socket.gateway';

@Module({
  imports: [
    ChatMessagesModule,
    UsersModule,
    MapperModule
  ],
  providers: [AppWebSocketGateway]
})
export class AppWebSocketModule { }