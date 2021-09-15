import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { AuthorizeGuard } from 'src/guards/authorize.guard';
import { Role } from 'src/models/auth/role';
import { ChatMessage } from 'src/models/chat-messages/chat-message';
import { ChatMessageDto } from 'src/models/chat-messages/chat-message-dto';
import { ChatMessageDtoPartial } from 'src/models/chat-messages/chat-message-dto-partial';
import { ChatMessageParams } from 'src/models/chat-messages/chat-message-params';
import { UserDto } from 'src/models/users/user-dto';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { UsersService } from '../users/users.service';
import { ChatMessagesService } from './chat-messages.service';

@Controller("api/chat-messages")
@UseGuards(AuthorizeGuard)
export class ChatMessagesController {
  constructor(private _messagesService: ChatMessagesService, private _usersService: UsersService, private _mapper: MapperService) { }

  @Get()
  public async getAllMessages(@Query() params: ChatMessageParams): Promise<ChatMessageDto[]> {
    const messages: ChatMessage[] = await this._messagesService.getAll(params);
    const dtos: ChatMessageDto[] = this._mapper.chatMessages.mapDtos(messages);

    return dtos;
  }

  @Get(":id")
  public async getMessage(@Param("id", ParseIntPipe) id: number): Promise<ChatMessageDto> {
    const message: ChatMessage = await this.tryGetMessageById(id);
    const dto: ChatMessageDto = this._mapper.chatMessages.mapDto(message);

    return dto;
  }

  @Post()
  public async postMessage(@Body() request: ChatMessageDto): Promise<ChatMessageDto> {
    if(!await this._usersService.idExists(request.senderUserId)) {
      throw new BadRequestException("A User ID with senderUserId value does not exist");
    }

    const message: ChatMessage = this._mapper.chatMessages.mapEntity(request);
    await this._messagesService.add(message);

    const dto: ChatMessageDto = this._mapper.chatMessages.mapDto(message);
    return dto;
  }

  @Put(":id")
  public async putMessage(@RequestUser() user: UserDto, @Param("id", ParseIntPipe) id: number, @Body() request: ChatMessageDtoPartial): Promise<ChatMessageDto> {
    const message: ChatMessage = await this.tryGetMessageById(id);

    if(message.senderUserId !== user.id && user.role !== Role.Administrator) {
      throw new ForbiddenException("You may not edit a different user's message");
    }

    //Do not change who the sender of the message is.
    delete request.senderUserId;

    this._mapper.chatMessages.mapEntity(request, message);
    await this._messagesService.update(message);
    
    const dto: ChatMessageDto = this._mapper.chatMessages.mapDto(message);
    return dto;
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteMessage(@RequestUser() user: UserDto, @Param("id", ParseIntPipe) id: number): Promise<void> {
    const message: ChatMessage = await this.tryGetMessageById(id);

    if(message.senderUserId !== user.id && user.role !== Role.Administrator) {
      throw new ForbiddenException("You may not delete a different user's message");
    }

    await this._messagesService.delete(id);
  }

  private async tryGetMessageById(id: number): Promise<ChatMessage> {
    const message: ChatMessage = await this._messagesService.getById(id);

    if(message == null) {
      throw new NotFoundException(`Chat Message ID does not exist: ${id}`);
    }

    return message;
  }
}