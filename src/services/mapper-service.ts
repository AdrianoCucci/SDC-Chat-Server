import { Organization } from "../models/organizations/organization";
import { OrganizationDto } from "../models/organizations/organization-dto";
import { Room } from "../models/rooms/room";
import { RoomDto } from "../models/rooms/room-dto";
import { User } from "../models/users/user";
import { UserDto } from "../models/users/user-dto";
import { EntityDtoMap } from "../utils/entity-dto-map";

export class MapperService {
  public readonly users = new EntityDtoMap<User, UserDto>({
    toEntity: (dto: UserDto): User => {
      delete dto.organization;

      const entity: User = dto as any;
      entity.password = null;

      return entity;
    },

    toDto: (entity: User): UserDto => {
      delete entity.password;
      return entity;
    }
  });

  public readonly organizations = new EntityDtoMap<Organization, OrganizationDto>({
    toEntity: (dto: OrganizationDto): Organization => {
      delete dto.fullAddress;
      return dto as Organization;
    },

    toDto: (entity: Organization): OrganizationDto => {
      const dto: OrganizationDto = entity as any;
      dto.fullAddress = `${dto.street}, ${dto.city}, ${dto.province}, ${dto.country} ${dto.postalCode}`.trim();

      return dto;
    }
  });

  public readonly rooms = new EntityDtoMap<Room, RoomDto>({
    toEntity: (dto: RoomDto): Room => {
      delete dto.organization;
      return dto as Room;
    },

    toDto: (entity: Room): RoomDto => entity
  });
}