import { Injectable } from "@nestjs/common";
import { ChatMessage } from "src/models/chat-messages/chat-message";
import { ChatMessageRequest } from "src/models/chat-messages/chat-message-request";
import { ChatMessageResponse } from "src/models/chat-messages/chat-message-response";
import { Organization } from "src/models/organizations/organization";
import { OrganizationDto } from "src/models/organizations/organization-dto";
import { User } from "src/models/users/user";
import { UserDto } from "src/models/users/user-dto";
import { EntityDtoMap } from "./entity-dto-map";

@Injectable()
export class MapperService {
  public readonly organizations = new EntityDtoMap<Organization, Partial<OrganizationDto>, OrganizationDto>({
    mapEntity: (request: OrganizationDto, target?: Organization): Organization => Object.assign(target ?? new Organization(), request),
    mapResponse: (entity: Organization): OrganizationDto => Object.assign(new OrganizationDto(), entity)
  });

  public readonly users = new EntityDtoMap<User, Partial<UserDto>, UserDto>({
    mapEntity: (request: UserDto, target?: User): User => Object.assign(target ?? new User(), request),
    mapResponse: (entity: User): UserDto => {
      const dto: UserDto = Object.assign(new UserDto(), entity);
      delete dto.password;
      
      return dto;
    }
  });

  public readonly chatMessages = new EntityDtoMap<ChatMessage, ChatMessageRequest, ChatMessageResponse>({
    mapEntity: (request: ChatMessageRequest, target?: ChatMessage): ChatMessage => Object.assign(target ?? new ChatMessage(), request),

    mapResponse: (entity: ChatMessage): ChatMessageResponse => {
      const response: ChatMessageResponse = Object.assign(new ChatMessageResponse(), entity);

      if(entity.senderUser != null) {
        response.senderUser = this.users.mapResponse(entity.senderUser);
      }

      return response;
    }
  });
}