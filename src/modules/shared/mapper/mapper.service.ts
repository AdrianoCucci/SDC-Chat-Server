import { Injectable } from "@nestjs/common";
import { ChatMessage } from "src/models/chat-messages/chat-message";
import { ChatMessageDto } from "src/models/chat-messages/chat-message-dto";
import { Organization } from "src/models/organizations/organization";
import { OrganizationDto } from "src/models/organizations/organization-dto";
import { Room } from "src/models/rooms/room";
import { RoomDto } from "src/models/rooms/room-dto";
import { User } from "src/models/users/user";
import { UserDto } from "src/models/users/user-dto";
import { EntityDtoMap } from "./entity-dto-map";

@Injectable()
export class MapperService {
  public readonly organizations = new EntityDtoMap<Organization, OrganizationDto>({
    mapEntity: (dto: Partial<OrganizationDto>, target?: Organization): Organization => Object.assign(target ?? new Organization(), dto),
    mapDto: (entity: Organization): OrganizationDto => Object.assign(new OrganizationDto(), entity)
  });

  public readonly users = new EntityDtoMap<User, UserDto>({
    mapEntity: (dto: Partial<UserDto>, target?: User): User => Object.assign(target ?? new User(), dto),
    mapDto: (entity: User): UserDto => {
      const dto: UserDto = Object.assign(new UserDto(), entity);
      delete dto.password;

      return dto;
    }
  });

  public readonly rooms = new EntityDtoMap<Room, RoomDto>({
    mapEntity: (dto: Partial<RoomDto>, target?: Room): Room => Object.assign(target ?? new Room(), dto),
    mapDto: (entity: Room): RoomDto => Object.assign(new Room(), entity)
  });

  public readonly chatMessages = new EntityDtoMap<ChatMessage, ChatMessageDto>({
    mapEntity: (dto: Partial<ChatMessageDto>, target?: ChatMessage): ChatMessage => Object.assign(target ?? new ChatMessage(), dto),

    mapDto: (entity: ChatMessage): ChatMessageDto => {
      const dto: ChatMessageDto = Object.assign(new ChatMessageDto(), entity);

      if(entity.senderUser != null) {
        dto.senderUser = this.users.mapDto(entity.senderUser);
      }

      return dto;
    }
  });
}