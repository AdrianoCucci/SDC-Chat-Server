import { RoomDto } from "../rooms/room-dto";
import { UserDto } from "../users/user-dto";
import { RoomPingState } from "./room-ping-state";

export class RoomPing {
  public state: RoomPingState = RoomPingState.Idle;
  public roomId: number;
  public requestDate: Date | string = new Date().toISOString();
  public requestMessage: string;
  public responseMessage?: string;
  public requestUserId: number;
  public responseUserId?: number;

  public room?: RoomDto;
  public requestUser?: UserDto;
  public responseUser?: UserDto;

  public constructor(values?: Partial<RoomPing>) {
    if(values != null) {
      Object.assign(this, values);
    }
  }
}