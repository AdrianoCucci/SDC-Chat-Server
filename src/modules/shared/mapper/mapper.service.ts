import { Injectable } from "@nestjs/common";
import { ChatMessageDto } from "src/modules/core/chat-messages/dtos/chat-message.dto";
import { ChatMessage } from "src/modules/core/chat-messages/entities/chat-message.entity";
import { OrganizationDto } from "src/modules/core/organizations/dtos/organization.dto";
import { Organization } from "src/modules/core/organizations/entities/organization.entity";
import { RoomDto } from "src/modules/core/rooms/dtos/room.dto";
import { Room } from "src/modules/core/rooms/entities/room.entity";
import { UserDto } from "src/modules/core/users/dtos/user.dto";
import { User } from "src/modules/core/users/entities/user.entity";
import { EntityDtoMap } from "./entity-dto-map";

@Injectable()
export class MapperService {
  public readonly organizations = new EntityDtoMap<Organization, OrganizationDto>({
    mapEntity: (dto: Partial<OrganizationDto>, target?: Organization): Organization => Object.assign(target ?? new Organization(), dto),
    mapDto: (entity: Organization): OrganizationDto => Object.assign(new OrganizationDto(), entity)
  });

  public readonly users = new EntityDtoMap<User, UserDto>({
    mapEntity: (dto: Partial<UserDto>, target?: User): User => {
      delete dto.password;
      return Object.assign(target ?? new User(), dto);
    },
    mapDto: (entity: User): UserDto => {
      const dto: UserDto = Object.assign(new User() as any, entity);

      if(entity.organization != null) {
        dto.organization = this.organizations.mapDto(entity.organization);
      }

      return dto;
    }
  });

  public readonly rooms = new EntityDtoMap<Room, RoomDto>({
    mapEntity: (dto: Partial<RoomDto>, target?: Room): Room => Object.assign(target ?? new Room(), dto),
    mapDto: (entity: Room): RoomDto => {
      const dto: RoomDto = Object.assign(new Room() as any, entity);

      if(entity.organization != null) {
        dto.organization = this.organizations.mapDto(entity.organization);
      }

      return dto;
    }
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