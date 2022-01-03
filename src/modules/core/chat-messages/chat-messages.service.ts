import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryBase } from 'src/utils/repository-base';
import { DeepPartial, FindConditions, FindManyOptions, FindOneOptions, LessThan, MoreThan, Repository } from 'typeorm';
import { ChatMessageQueryDto } from './dtos/chat-message-query.dto';
import { ChatMessage } from './entities/chat-message.entity';

@Injectable()
export class ChatMessagesService extends RepositoryBase<ChatMessage> {
  constructor(@InjectRepository(ChatMessage) repository: Repository<ChatMessage>) {
    super(repository);
  }

  public getOneByModel(model: DeepPartial<ChatMessageQueryDto>): Promise<ChatMessage> {
    return super.getOneByModel(model);
  }

  public getAllByModel(model: DeepPartial<ChatMessageQueryDto>): Promise<ChatMessage[]> {
    return super.getAllByModel(model);
  }

  protected onGettingByModel(model: ChatMessageQueryDto): FindOneOptions<ChatMessage> | FindManyOptions<ChatMessage> {
    const { minDate, maxDate, ...rest } = model;
    const findConditions: FindConditions<ChatMessage>[] = [];

    if(model.minDate) {
      findConditions.push({ ...rest, datePosted: MoreThan(minDate) });
    }
    if(model.maxDate) {
      findConditions.push({ ...rest, datePosted: LessThan(maxDate) });
    }
    if(Object.keys(rest).length > 0) {
      findConditions.push(rest);
    }
    
    return { where: findConditions };
  }
}