import { Module } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessagesController } from './chat-messages.controller';

@Module({
  providers: [ChatMessagesService],
  controllers: [ChatMessagesController]
})
export class ChatMessagesModule {}