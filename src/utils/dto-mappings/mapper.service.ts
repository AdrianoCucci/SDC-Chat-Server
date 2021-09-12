import { Injectable } from "@nestjs/common";
import { ChatMessage } from "src/models/chat-messages/chat-message";
import { ChatMessageRequest } from "src/models/chat-messages/chat-message-request";
import { ChatMessageResponse } from "src/models/chat-messages/chat-message-response";
import { User } from "src/models/users/user";
import { UserRequest } from "src/models/users/user-request";
import { UserResponse } from "src/models/users/user-response";
import { EntityDtoMap } from "./entity-dto-map";

@Injectable()
export class MapperService {
  public readonly users = new EntityDtoMap<User, UserRequest, UserResponse>({
    toEntity: (request: UserRequest, target?: User): User => Object.assign(target ?? new User(), request),

    toResponse: (entity: User): UserResponse => {
      delete entity.password;
      return Object.assign(new UserResponse(), entity);
    }
  });

  public readonly chatMessages = new EntityDtoMap<ChatMessage, ChatMessageRequest, ChatMessageResponse>({
    toEntity: (request: ChatMessageRequest, target?: ChatMessage): ChatMessage => Object.assign(target ?? new ChatMessage(), request),

    toResponse: (entity: ChatMessage): ChatMessageResponse => {
      const response = new ChatMessageResponse();
      Object.assign(response, entity);

      if(entity.senderUser != null) {
        response.senderUser = this.users.toResponse(entity.senderUser);
      }

      return response;
    }
  });
}