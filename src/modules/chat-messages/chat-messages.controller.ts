import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthorizeGuard } from 'src/guards/authorize.guard';
import { ChatMessage } from 'src/models/chat-messages/chat-message';
import { ChatMessageParams } from 'src/models/chat-messages/chat-message-params';
import { ChatMessageResponse } from 'src/models/chat-messages/chat-message-response';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { ChatMessagesService } from './chat-messages.service';

@Controller('chat-messages')
@UseGuards(AuthorizeGuard)
export class ChatMessagesController {
  constructor(private _messagesService: ChatMessagesService, private _mapper: MapperService) { }

  @Get()
  public async getAllMessages(@Query() params: ChatMessageParams): Promise<ChatMessageResponse[]> {
    const messages: ChatMessage[] = await this._messagesService.getAll(params);
    const dtos: ChatMessageResponse[] = this._mapper.chatMessages.mapResponses(messages);

    return dtos;
  }
}