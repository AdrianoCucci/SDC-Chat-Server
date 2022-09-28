import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryBase } from "src/utils/repository-base";
import { Repository } from "typeorm";
import { ChatMessage } from "./entities/chat-message.entity";

@Injectable()
export class ChatMessagesService extends RepositoryBase<ChatMessage> {
  constructor(
    @InjectRepository(ChatMessage) repository: Repository<ChatMessage>
  ) {
    super(repository);
  }
}
