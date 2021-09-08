import { Application } from "express";
import { IDbContext } from "../../database/interfaces/db-context";
import { MapperService } from "../../services/mapper-service";
import { ApiControllerError } from "../../utils/api-controller-error";
import { handleApiControllerError } from "../../utils/handle-api-controller-error";
import { requireAdministrator, requireAuth } from "../middlewares/require-authorizations";
import { IApiController } from "../interfaces/api-controller";
import { requireBody } from "../middlewares/require-body";
import { Room } from "../../models/rooms/room";
import { RoomDto } from "../../models/rooms/room-dto";

export class RoomsController implements IApiController {
  private readonly _route: string = "/api/rooms";
  private readonly _context: IDbContext;
  private readonly _mapper: MapperService;

  public constructor(context: IDbContext, mapper: MapperService) {
    this._context = context;
    this._mapper = mapper;
  }

  public configure(expressApp: Application) {
    expressApp.get(this._route, requireAuth, async (request, response) => {
      const rooms: Room[] = await this._context.rooms.getAll();
      const dtos: RoomDto[] = this._mapper.rooms.toDtoArray(rooms);

      response.status(200).json(dtos);
    });

    expressApp.get(`${this._route}/:id`, requireAuth, async (request, response) => {
      try {
        const id: number = Number(request.params.id);
        const room: Room = await this._context.rooms.getById(id);
  
        if(room == null) {
          throw new ApiControllerError(404, `Room with ID does not exist: ${id}`);
        }
  
        const dtoResponse: RoomDto = this._mapper.rooms.toDto(room);
        response.status(200).send(dtoResponse);
      }
      catch(error) {
        handleApiControllerError(error, response);
      }
    });

    expressApp.post(this._route, requireAdministrator, requireBody, async (request, response) => {
      try {
        const dtoRequest: RoomDto = request.body;

        const entity: Room = this._mapper.rooms.toEntity(dtoRequest);
        this._context.rooms.add(entity);
        await this._context.rooms.commit();

        const dtoResponse: RoomDto = this._mapper.rooms.toDto(entity);
        response.status(200).send(dtoResponse);
      }
      catch(error) {
        handleApiControllerError(error, response);
      }
    });

    expressApp.put(`${this._route}/:id`, requireAdministrator, requireBody, async (request, response) => {
      try {
        const dtoRequest: RoomDto = request.body;

        const id: number = Number(request.params.id);
        const Room: Room = await this._context.rooms.getById(id);
        if(Room == null) {
          throw new ApiControllerError(404, `Room with ID does not exist: ${id}`);
        }

        Object.assign(Room, dtoRequest);

        this._context.rooms.update(id, Room);
        await this._context.rooms.commit();

        response.status(200).json(Room);
      }
      catch(error) {
        handleApiControllerError(error, response);
      }
    });

    expressApp.delete(`${this._route}/:id`, requireAdministrator, async (request, response) => {
      try {
        const id: number = Number(request.params.id);
        const organizationExists: boolean = await this._context.rooms.hasEntity(id);

        if(!organizationExists) {
          throw new ApiControllerError(404, `Room with ID does not exist: ${id}`);
        }

        this._context.rooms.delete(id);
        await this._context.rooms.commit();

        response.status(200).send("Room deleted successfully");
      }
      catch(error) {
        handleApiControllerError(error, response);
      }
    });
  }
}