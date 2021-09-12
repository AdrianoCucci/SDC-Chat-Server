import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizeRolesGuard } from './guards/authorize-roles.guard';
import { ChatMessagesModule } from './modules/chat-messages/chat-messages.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
    ChatMessagesModule
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthorizeRolesGuard }
  ]
})
export class AppModule { }