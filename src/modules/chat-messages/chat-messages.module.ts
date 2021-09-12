import { Module } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessagesController } from './chat-messages.controller';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from '../users/users.service';

@Module({
  imports: [AuthModule],
  providers: [
    ChatMessagesService,
    UsersService,
    MapperService
  ],
  controllers: [ChatMessagesController]
})
export class ChatMessagesModule { }