import { Controller, UseGuards, UseInterceptors, ClassSerializerInterceptor, Get, Query, Param, ParseIntPipe, Post, Body, Put, ForbiddenException, Delete, HttpCode, HttpStatus, NotFoundException, ConflictException } from "@nestjs/common";
import { Includes } from "src/decorators/includes.decorator";
import { RequestUser } from "src/decorators/request-user.decorator";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/models/auth/role";
import { PagedList } from "src/models/pagination/paged-list";
import { PagedModel } from "src/models/pagination/paged-model";
import { AuthorizeGuard } from "src/modules/shared/jwt-auth/authorize.guard";
import { MapperService } from "src/modules/shared/mapper/mapper.service";
import { catchEntityColumnNotFound } from "src/utils/controller-utils";
import { OrganizationsService } from "../organizations/organizations.service";
import { UserDto } from "../users/dtos/user.dto";
import { PartialRoomDto } from "./dtos/partial-room.dto";
import { RoomQueryDto } from "./dtos/room-query.dto";
import { RoomDto } from "./dtos/room.dto";
import { Room } from "./entities/room.entity";
import { RoomsService } from "./rooms.service";

@Controller("rooms")
// @UseGuards(AuthorizeGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class RoomsController {
  constructor(private _roomsService: RoomsService, private _orgsService: OrganizationsService, private _mapper: MapperService) { }

  @Get()
  public async getAllRooms(@Query() model?: PagedModel<RoomQueryDto>, @Includes() includes?: string[]): Promise<PagedList<RoomDto>> {
    const { skip, take, include, ...rest } = model;

    const result: PagedList<RoomDto> = await catchEntityColumnNotFound(async () => {
      const rooms: PagedList<Room> = await this._roomsService.getAllPaged({
        where: rest,
        skip,
        take,
        relations: includes
      });

      const dtos: RoomDto[] = this._mapper.rooms.mapDtos(rooms.data);
      return new PagedList<RoomDto>({ data: dtos, meta: rooms.pagination });
    });

    return result;
  }

  @Get(":id")
  public async getRoomById(@Param("id", ParseIntPipe) id: number, @Includes() includes?: string[]): Promise<RoomDto> {
    const room: Room = await this.tryGetRoomById(id, includes);
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

    let room: Room = this._mapper.rooms.mapEntity(request);
    room = await this._roomsService.add(room);

    const response: RoomDto = this._mapper.rooms.mapDto(room);
    return response;
  }

  @Put(":id")
  @Roles(Role.Administrator, Role.OrganizationAdmin)
  public async putRoom(@RequestUser() user: UserDto, @Param("id", ParseIntPipe) id: number, @Body() request: PartialRoomDto): Promise<RoomDto> {
    let room: Room = await this.tryGetRoomById(id);

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
    room = await this._roomsService.update(room);

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

    await this._roomsService.delete(room);
  }

  private async tryGetRoomById(id: number, includes?: string[]): Promise<Room> {
    const room: Room = await this._roomsService.getOneById(id, { relations: includes });

    if(room == null) {
      throw new NotFoundException(`Room ID does not exist: ${id}`);
    }

    return room;
  }

  private async validateRequest(request: RoomDto | PartialRoomDto): Promise<void> {
    if(!await this._orgsService.hasAnyWithId(request.organizationId)) {
      throw new ConflictException(`organizationId does not exist: ${request.organizationId}`);
    }
  }
}