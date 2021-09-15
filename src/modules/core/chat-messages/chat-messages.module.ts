import { Module } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessagesController } from './chat-messages.controller';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
  ],
  exports: [ChatMessagesService],
  providers: [
    ChatMessagesService,
    MapperService
  ],
  controllers: [ChatMessagesController]
})
export class ChatMessagesModule { }