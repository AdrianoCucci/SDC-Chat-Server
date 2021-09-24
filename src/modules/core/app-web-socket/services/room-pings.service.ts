import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { RoomPing } from 'src/models/room-pings/room-ping';
import { RoomPingState } from 'src/models/room-pings/room-ping-state';
import { UserDto } from 'src/models/users/user-dto';
import { SOCKET_EVENTS } from '../utils/socket-events';
import { broadcast, getUserRoom } from '../utils/socket-functions';
import { SocketUsersService } from './socket-users.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RoomPingsService {
  private readonly _requestingPings: RoomPing[] = [];

  constructor(private _socketUsersService: SocketUsersService) { }

  public onRoomPingRequest(socket: Socket, payload: RoomPing): void {
    if(!this.hasRequestingPing(payload?.guid)) {
      const requestUser: UserDto = this._socketUsersService.get(socket);

      if(requestUser?.organizationId != null) {
        payload.state = RoomPingState.Requesting;
        payload.organizationId = requestUser.organizationId;
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
    const requestingPing: RoomPing = this.findRequestingPing(payload?.guid);

    if(requestingPing != null) {
      const responseUser: UserDto = this._socketUsersService.get(socket);

      if(responseUser?.organizationId === requestingPing.organizationId) {
        requestingPing.state = RoomPingState.Responded;
        requestingPing.responseUser = responseUser;

        const room: string = getUserRoom(responseUser);
        broadcast(socket, SOCKET_EVENTS.roomPingRequest, requestingPing, room);

        this.removeRequestingPing(requestingPing);
      }
    }
  }

  public onRoomPingCancel(socket: Socket, payload: RoomPing): void {
    const user: UserDto = this._socketUsersService.get(socket);

    if(user?.organizationId != null) {
      const requestingPing: RoomPing = this.findRequestingPing(payload?.guid);

      if(requestingPing?.organizationId === user.organizationId) {
        const room: string = getUserRoom(user);
        broadcast(socket, SOCKET_EVENTS.roomPingCancel, requestingPing, room);

        this.removeRequestingPing(requestingPing);
      }
    }
  }

  public onGetRequestingPings(socket: Socket): RoomPing[] {
    let pings: RoomPing[] = null;

    const user: UserDto = this._socketUsersService.get(socket);
    if(user?.organizationId != null) {
      pings = this.getOrganizationPingRequests(user.organizationId);
    }

    return pings;
  }

  private findRequestingPing(guid: string): RoomPing {
    return this._requestingPings.find((r: RoomPing) => r.guid === guid);
  }

  private findRequestingPingIndex(guid: string): number {
    return this._requestingPings.findIndex((r: RoomPing) => r.guid === guid);
  }

  private hasRequestingPing(guid: string): boolean {
    return this.findRequestingPingIndex(guid) !== -1;
  }

  private removeRequestingPing(roomPing: RoomPing): boolean {
    const index: number = this._requestingPings.indexOf(roomPing);
    const canRemove: boolean = index !== -1;

    if(canRemove) {
      this._requestingPings.splice(index, 1);
    }

    return canRemove;
  }

  private getOrganizationPingRequests(organizationId: number): RoomPing[] {
    return this._requestingPings.filter((r: RoomPing) => r.organizationId === organizationId);
  }
}