import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryBase } from 'src/utils/repository-base';
import { FindConditions, FindManyOptions, FindOneOptions, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { ChatMessageQueryDto } from './dtos/chat-message-query.dto';
import { ChatMessage } from './entities/chat-message.entity';

@Injectable()
export class ChatMessagesService extends RepositoryBase<ChatMessage> {
  constructor(@InjectRepository(ChatMessage) repository: Repository<ChatMessage>) {
    super(repository);
  }

  protected onGettingByModel(model: ChatMessageQueryDto): FindOneOptions<ChatMessage> | FindManyOptions<ChatMessage> {
    const findConditions: FindConditions<ChatMessage>[] = [model];

    if(model.minDate) {
      findConditions.push({ ...model, datePosted: MoreThanOrEqual(model.datePosted) });
    }
    if(model.maxDate) {
      findConditions.push({ ...model, datePosted: LessThanOrEqual(model.datePosted) });
    }

    return { where: findConditions };
  }
}