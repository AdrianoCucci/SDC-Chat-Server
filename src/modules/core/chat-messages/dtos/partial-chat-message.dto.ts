import { PartialType } from '@nestjs/mapped-types';
import { ChatMessageDto } from './chat-message.dto';

export class PartialChatMessageDto extends PartialType(ChatMessageDto) { }