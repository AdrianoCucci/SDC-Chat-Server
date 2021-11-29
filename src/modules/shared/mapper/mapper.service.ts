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
    mapDto: (entity: Organization): OrganizationDto => {
      const dto: OrganizationDto = Object.assign(new OrganizationDto(), entity);

      if(entity.users?.length > 0) {
        dto.users = this.users.mapDtos(entity.users);
      }
      if(entity.rooms?.length > 0) {
        dto.rooms = this.rooms.mapDtos(entity.rooms);
      }
      if(entity.chatMessages?.length > 0) {
        dto.chatMessages = this.chatMessages.mapDtos(entity.chatMessages);
      }

      return dto;
    }
  });

  public readonly users = new EntityDtoMap<User, UserDto>({
    mapEntity: (dto: Partial<UserDto>, target?: User): User => {
      delete dto.password;
      return Object.assign(target ?? new User(), dto);
    },
    mapDto: (entity: User): UserDto => {
      const { userSecretId, userSecret, ...rest } = entity;

      const dto: UserDto = Object.assign(new UserDto(), rest);

      if(rest.organization != null) {
        dto.organization = this.organizations.mapDto(rest.organization);
      }
      if(rest.chatMessages?.length > 0) {
        dto.chatMessages = this.chatMessages.mapDtos(rest.chatMessages);
      }

      return dto;
    }
  });

  public readonly rooms = new EntityDtoMap<Room, RoomDto>({
    mapEntity: (dto: Partial<RoomDto>, target?: Room): Room => Object.assign(target ?? new Room(), dto),
    mapDto: (entity: Room): RoomDto => {
      const dto: RoomDto = Object.assign(new RoomDto(), entity);

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
      if(entity.organization != null) {
        dto.organization = this.organizations.mapDto(entity.organization);
      }

      return dto;
    }
  });
}