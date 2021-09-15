import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule } from './modules/shared/jwt-auth/jwt-auth.module';
import { AuthModule } from './modules/core/auth/auth.module';
import { UsersModule } from './modules/core/users/users.module';
import { ChatMessagesModule } from './modules/core/chat-messages/chat-messages.module';
import { OrganizationsModule } from './modules/core/organizations/organizations.module';
import { AppWebSocketModule } from './modules/core/app-web-socket/app-web-socket.module';
import { MapperModule } from './modules/shared/mapper/mapper.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtAuthModule,
    AuthModule,
    UsersModule,
    ChatMessagesModule,
    OrganizationsModule,
    AppWebSocketModule,
    MapperModule
  ],
})
export class AppModule { }