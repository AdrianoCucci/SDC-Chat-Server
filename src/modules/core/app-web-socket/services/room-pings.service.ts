import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { RoomPing } from 'src/models/room-pings/room-ping';
import { RoomPingState } from 'src/models/room-pings/room-ping-state';
import { UserDto } from 'src/models/users/user-dto';
import { SOCKET_EVENTS } from '../utils/socket-events';
import { broadcast, getUserRoom } from '../utils/socket-functions';
import { SocketUsersService } from './socket-users.service';
import { v4 as uuidv4 } from 'uuid';
import { WsResponse } from '@nestjs/websockets';

@Injectable()
export class RoomPingsService {
  private readonly _requestingPings: RoomPing[] = [];

  constructor(private _socketUsersService: SocketUsersService) { }

  public onRoomPingRequest(socket: Socket, payload: RoomPing): void {
    if(!this.hasRequestingPing(payload)) {
      const requestUser: UserDto = this._socketUsersService.get(socket);

      if(requestUser != null) {
        payload.state = RoomPingState.Requesting;
        payload.requestUser = requestUser;

        if(!payload.guid) {
          payload.guid = uuidv4();
        }
        if(!payload.requestDate) {
          payload.requestDate = new Date().toISOString();
        }

        this._requestingPings.push(payload);

        const room: string = getUserRoom(requestUser);
        broadcast(socket, SOCKET_EVENTS.roomPingRequest, payload, room);
      }
    }
  }

  public onRoomPingResponse(socket: Socket, payload: RoomPing): void {
    if(this.hasRequestingPing(payload)) {
      const responseUser: UserDto = this._socketUsersService.get(socket);

      if(responseUser != null) {
        payload.state = RoomPingState.Responded;
        payload.responseUser = responseUser;

        const room: string = getUserRoom(responseUser);
        broadcast(socket, SOCKET_EVENTS.roomPingRequest, payload, room);

        this.removeRequestingPing(payload);
      }
    }
  }

  public onGetRequestingPings(socket: Socket): WsResponse<RoomPing[]> {
    let pings: RoomPing[] = null;

    const user: UserDto = this._socketUsersService.get(socket);
    if(user?.organizationId != null) {
      pings = this.getOrganizationPingRequests(user.organizationId);
    }

    return {
      event: SOCKET_EVENTS.getRoomPings,
      data: pings
    };
  }

  private findRequestingPingIndex(roomPing: RoomPing): number {
    return this._requestingPings.findIndex((r: RoomPing) => r.guid === roomPing.guid);
  }

  private hasRequestingPing(roomPing: RoomPing): boolean {
    return this.findRequestingPingIndex(roomPing) !== -1;
  }

  private removeRequestingPing(roomPing: RoomPing): void {
    const index: number = this.findRequestingPingIndex(roomPing);

    if(index !== -1) {
      this._requestingPings.splice(index, 1);
    }
  }

  private getOrganizationPingRequests(organizationId: number): RoomPing[] {
    return this._requestingPings.filter((r: RoomPing) => r.organizationId === organizationId);
  }
}