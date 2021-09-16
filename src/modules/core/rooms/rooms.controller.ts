import { Controller, Get, Query, Param, ParseIntPipe, NotFoundException, Post, Body, ConflictException, Put, ForbiddenException, Delete, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { RequestUser } from "src/decorators/request-user.decorator";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/models/auth/role";
import { Room } from "src/models/rooms/room";
import { RoomDto } from "src/models/rooms/room-dto";
import { RoomDtoPartial } from "src/models/rooms/room-dto-partial";
import { RoomParams } from "src/models/rooms/room-params";
import { UserDto } from "src/models/users/user-dto";
import { AuthorizeGuard } from "src/modules/shared/jwt-auth/authorize.guard";
import { MapperService } from "src/modules/shared/mapper/mapper.service";
import { OrganizationsService } from "../organizations/organizations.service";
import { RoomsService } from "./rooms.service";

@Controller("api/rooms")
@UseGuards(AuthorizeGuard)
export class RoomsController {
  constructor(private _roomsService: RoomsService, private _orgsService: OrganizationsService, private _mapper: MapperService) { }

  @Get()
  public async getAllRooms(@Query() params: RoomParams): Promise<RoomDto[]> {
    const rooms: Room[] = await this._roomsService.getAll(params);
    const dtos: RoomDto[] = this._mapper.rooms.mapDtos(rooms);

    return dtos;
  }

  @Get(":id")
  public async getRoomById(@Param("id", ParseIntPipe) id: number): Promise<RoomDto> {
    const room: Room = await this.tryGetRoomById(id);
    const dto: RoomDto = this._mapper.rooms.mapDto(room);

    return dto;
  }

  @Post()
  @Roles(Role.Administrator, Role.OrganizationAdmin)
  public async postRoom(@RequestUser() user: UserDto, @Body() request: RoomDto): Promise<RoomDto> {
    //Make sure non-administrators can only post new rooms in their associated organizations.
    if(user.role !== Role.Administrator) {
      request.organizationId = user.organizationId;
    }

    await this.validateRequest(request);

    const room: Room = this._mapper.rooms.mapEntity(request);
    await this._roomsService.add(room);

    const response: RoomDto = this._mapper.rooms.mapDto(room);
    return response;
  }

  @Put(":id")
  @Roles(Role.Administrator, Role.OrganizationAdmin)
  public async putRoom(@RequestUser() user: UserDto, @Param("id", ParseIntPipe) id: number, @Body() request: RoomDtoPartial): Promise<RoomDto> {
    const room: Room = await this.tryGetRoomById(id);

    if(user.organizationId !== room.organizationId && user.role !== Role.Administrator) {
      throw new ForbiddenException("You do not have permission to update this room");
    }

    //Make sure non-administrators cannot change the organization of a room.
    if(user.role !== Role.Administrator) {
      request.organizationId = room.organizationId;
    }
    else if(request.organizationId != null) {
      await this.validateRequest(request);
    }

    this._mapper.rooms.mapEntity(request, room);
    await this._roomsService.update(room);

    const response: RoomDto = this._mapper.rooms.mapDto(room);
    return response;
  }

  @Delete(":id")
  @Roles(Role.Administrator, Role.OrganizationAdmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteRoom(@RequestUser() user: UserDto, @Param("id", ParseIntPipe) id: number): Promise<void> {
    const room: Room = await this.tryGetRoomById(id);

    if(user.organizationId !== room.organizationId && user.role !== Role.Administrator) {
      throw new ForbiddenException("You do not have permission to delete this room");
    }

    await this._roomsService.delete(id);
  }

  private async tryGetRoomById(id: number): Promise<Room> {
    const room: Room = await this._roomsService.getById(id);

    if(room == null) {
      throw new NotFoundException(`Room ID does not exist: ${id}`);
    }

    return room;
  }

  private async validateRequest(request: RoomDto | RoomDtoPartial): Promise<void> {
    if(!await this._orgsService.idExists(request.organizationId)) {
      throw new ConflictException(`organizationId does not exist: ${request.organizationId}`);
    }
  }
}