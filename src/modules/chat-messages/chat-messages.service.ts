import { Injectable } from '@nestjs/common';
import { ChatMessage } from 'src/models/chat-messages/chat-message';
import { ChatMessageParams } from 'src/models/chat-messages/chat-message-params';
import { ServiceBase } from 'src/utils/dto-mappings/service-base';

@Injectable()
export class ChatMessagesService extends ServiceBase<ChatMessage> {
  constructor() {
    super("id");
  }

  public async getAll(params?: ChatMessageParams): Promise<ChatMessage[]> {
    const predicate = ChatMessageParams.getPredicate(params);
    return this.findEntities(predicate);
  }
}