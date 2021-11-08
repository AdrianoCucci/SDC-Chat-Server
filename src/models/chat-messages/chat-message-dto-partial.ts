import { PartialType } from '@nestjs/mapped-types';
import { ChatMessageDto } from './chat-message-dto';

export class ChatMessageDtoPartial extends PartialType(ChatMessageDto) { }