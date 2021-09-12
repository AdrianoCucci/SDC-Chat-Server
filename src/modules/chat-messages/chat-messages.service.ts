import { Injectable } from '@nestjs/common';
import { ChatMessage } from 'src/models/chat-messages/chat-message';
import { ChatMessageParams } from 'src/models/chat-messages/chat-message-params';
import { ServiceBase } from 'src/utils/dto-mappings/service-base';

@Injectable()
export class ChatMessagesService extends ServiceBase<ChatMessage> {
  constructor() {
    super("id",
      [
        { id: 1, contents: "Sample Text", datePosted: new Date(2021, 6, 14).toISOString(), senderUserId: 1 },
        { id: 2, contents: "Sample Text", datePosted: new Date(2021, 6, 16).toISOString(), senderUserId: 2 },
        { id: 3, contents: "Sample Text", datePosted: new Date(2021, 6, 21).toISOString(), senderUserId: 2 },
        { id: 4, contents: "Sample Text", datePosted: new Date(2021, 6, 22).toISOString(), senderUserId: 1 }
      ]
    );
  }

  public async getAll(params?: ChatMessageParams): Promise<ChatMessage[]> {
    const predicate = ChatMessageParams.getPredicate(params);
    return this.findEntities(predicate);
  }
}