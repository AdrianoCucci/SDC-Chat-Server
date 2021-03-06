import { RoomDto } from "../../rooms/dtos/room.dto";
import { UserDto } from "../../users/dtos/user.dto";
import { RoomPingState } from "./room-ping-state";

export interface RoomPing {
  guid: string;
  state: RoomPingState;
  roomId: number;
  organizationId: number;
  requestDate: Date | string;
  requestMessage: string;
  responseMessage?: string;
  requestUserId: number;
  responseUserId?: number;

  room?: RoomDto;
  requestUser?: UserDto;
  responseUser?: UserDto;
}