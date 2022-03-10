import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessagesTasksService } from './chat-messages-tasks.service';
import { ChatMessagesController } from './chat-messages.controller';
import { JwtAuthModule } from 'src/modules/shared/jwt-auth/jwt-auth.module';
import { UsersModule } from '../users/users.module';
import { MapperModule } from 'src/modules/shared/mapper/mapper.module';
import { ChatMessage } from './entities/chat-message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessage]),
    JwtAuthModule,
    UsersModule,
    MapperModule
  ],
  exports: [
    ChatMessagesService,
    ChatMessagesTasksService
  ],
  providers: [
    ChatMessagesService,
    ChatMessagesTasksService
  ],
  controllers: [ChatMessagesController]
})
export class ChatMessagesModule { }