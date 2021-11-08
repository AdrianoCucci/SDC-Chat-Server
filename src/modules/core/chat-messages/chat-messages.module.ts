import { Module } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessagesController } from './chat-messages.controller';
import { JwtAuthModule } from 'src/modules/shared/jwt-auth/jwt-auth.module';
import { UsersModule } from '../users/users.module';
import { MapperModule } from 'src/modules/shared/mapper/mapper.module';

@Module({
  imports: [
    JwtAuthModule,
    UsersModule,
    MapperModule
  ],
  exports: [ChatMessagesService],
  providers: [ChatMessagesService],
  controllers: [ChatMessagesController]
})
export class ChatMessagesModule { }