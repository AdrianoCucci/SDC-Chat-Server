import { Injectable } from '@nestjs/common';
import { ServiceBase } from 'src/utils/service-base';
import { ChatMessageQuery } from './dtos/chat-message-query.dto';
import { ChatMessage } from './entities/chat-message.entity';

@Injectable()
export class ChatMessagesService extends ServiceBase<ChatMessage> {
  constructor() {
    super("id");
  }

  public async getAll(query?: ChatMessageQuery): Promise<ChatMessage[]> {
    const predicate = ChatMessageQuery.getPredicate(query);
    return this.findEntities(predicate);
  }
}