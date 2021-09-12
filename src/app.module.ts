import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatMessagesModule } from './modules/chat-messages/chat-messages.module';
import { AppWebSocketModule } from './modules/app-web-socket/app-web-socket.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
    ChatMessagesModule,
    AppWebSocketModule
  ],
})
export class AppModule { }