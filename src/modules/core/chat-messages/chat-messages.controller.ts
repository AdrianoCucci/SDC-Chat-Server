import { Controller, UseGuards, UseInterceptors, ClassSerializerInterceptor, Get, Query, Param, ParseIntPipe, Post, Body, BadRequestException, Put, ForbiddenException, Delete, HttpCode, HttpStatus, NotFoundException } from "@nestjs/common";
import { Includes } from "src/decorators/includes.decorator";
import { RequestUser } from "src/decorators/request-user.decorator";
import { Role } from "src/models/auth/role";
import { PagedList } from "src/models/pagination/paged-list";
import { PagedModel } from "src/models/pagination/paged-model";
import { AuthorizeGuard } from "src/modules/shared/jwt-auth/authorize.guard";
import { MapperService } from "src/modules/shared/mapper/mapper.service";
import { catchEntityColumnNotFound } from "src/utils/controller-utils";
import { UserDto } from "../users/dtos/user.dto";
import { UsersService } from "../users/users.service";
import { ChatMessagesService } from "./chat-messages.service";
import { ChatMessageQueryDto } from "./dtos/chat-message-query.dto";
import { ChatMessageDto } from "./dtos/chat-message.dto";
import { PartialChatMessageDto } from "./dtos/partial-chat-message.dto";
import { ChatMessage } from "./entities/chat-message.entity";

@Controller("chat-messages")
@UseGuards(AuthorizeGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ChatMessagesController {
  constructor(private _messagesService: ChatMessagesService, private _usersService: UsersService, private _mapper: MapperService) { }

  @Get()
  public async getAllMessages(@Query() model?: PagedModel<ChatMessageQueryDto>, @Includes() includes?: string[]): Promise<PagedList<ChatMessageDto>> {
    const { skip, take, include, ...rest } = model;

    const result: PagedList<ChatMessageDto> = await catchEntityColumnNotFound(async () => {
      const messages: PagedList<ChatMessage> = await this._messagesService.getAllPaged({
        where: rest,
        skip,
        take,
        relations: includes
      });

      const dtos: ChatMessageDto[] = this._mapper.chatMessages.mapDtos(messages.data);
      return new PagedList<ChatMessageDto>({ data: dtos, meta: messages.pagination });
    });

    return result;
  }

  @Get(":id")
  public async getMessage(@Param("id", ParseIntPipe) id: number, @Includes() includes?: string[]): Promise<ChatMessageDto> {
    const message: ChatMessage = await this.tryGetMessageById(id, includes);
    const dto: ChatMessageDto = this._mapper.chatMessages.mapDto(message);

    return dto;
  }

  @Post()
  public async postMessage(@Body() request: ChatMessageDto): Promise<ChatMessageDto> {
    if(!await this._usersService.hasAnyWithId(request.senderUserId)) {
      throw new BadRequestException("A User ID with [senderUserId] value does not exist");
    }

    let message: ChatMessage = this._mapper.chatMessages.mapEntity(request);
    message = await this._messagesService.add(message);

    const dto: ChatMessageDto = this._mapper.chatMessages.mapDto(message);
    return dto;
  }

  @Put(":id")
  public async putMessage(@RequestUser() user: UserDto, @Param("id", ParseIntPipe) id: number, @Body() request: PartialChatMessageDto): Promise<ChatMessageDto> {
    let message: ChatMessage = await this.tryGetMessageById(id);

    if(message.senderUserId !== user.id && user.role !== Role.Administrator) {
      throw new ForbiddenException("You may not edit a different user's message");
    }

    //Do not change who the sender of the message is.
    delete request.senderUserId;

    this._mapper.chatMessages.mapEntity(request, message);
    message = await this._messagesService.update(message);

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

    await this._messagesService.delete(message);
  }

  private async tryGetMessageById(id: number, includes?: string[]): Promise<ChatMessage> {
    const message: ChatMessage = await this._messagesService.getOneById(id, { relations: includes });

    if(message == null) {
      throw new NotFoundException(`Chat Message ID does not exist: ${id}`);
    }

    return message;
  }
}