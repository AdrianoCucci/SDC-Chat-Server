import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/core/auth/auth.module';
import { UsersModule } from './modules/core/users/users.module';
import { ChatMessagesModule } from './modules/core/chat-messages/chat-messages.module';
import { OrganizationsModule } from './modules/core/organizations/organizations.module';
import { AppWebSocketModule } from './modules/core/app-web-socket/app-web-socket.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
    ChatMessagesModule,
    OrganizationsModule,
    AppWebSocketModule
  ],
})
export class AppModule { }