import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthModule } from './modules/shared/jwt-auth/jwt-auth.module';
import { AuthModule } from './modules/core/auth/auth.module';
import { UsersModule } from './modules/core/users/users.module';
import { UserSecretsModule } from './modules/core/user-secrets/user-secrets.module';
import { ChatMessagesModule } from './modules/core/chat-messages/chat-messages.module';
import { OrganizationsModule } from './modules/core/organizations/organizations.module';
import { RoomsModule } from './modules/core/rooms/rooms.module';
import { AppWebSocketModule } from './modules/core/app-web-socket/app-web-socket.module';
import { MapperModule } from './modules/shared/mapper/mapper.module';
import appConfig from './app.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(appConfig.typeOrm),
    JwtAuthModule,
    AuthModule,
    UsersModule,
    UserSecretsModule,
    ChatMessagesModule,
    OrganizationsModule,
    RoomsModule,
    AppWebSocketModule,
    MapperModule
  ]
})
export class AppModule { }