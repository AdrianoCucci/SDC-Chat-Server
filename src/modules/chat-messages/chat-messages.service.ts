import { Injectable } from '@nestjs/common';
import { ChatMessage } from 'src/models/chat-messages/chat-message';
import { ServiceBase } from 'src/utils/dto-mappings/service-base';

@Injectable()
export class ChatMessagesService extends ServiceBase<ChatMessage> {
  constructor() {
    super("id");
  }

  public async getAllBySender(senderUserId: number): Promise<ChatMessage[]> {
    return this.findEntities((message: ChatMessage) => message.senderUserId === senderUserId);
  }
}