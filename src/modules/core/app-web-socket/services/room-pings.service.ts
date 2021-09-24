import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { RoomPing } from 'src/models/room-pings/room-ping';
import { RoomPingState } from 'src/models/room-pings/room-ping-state';
import { UserDto } from 'src/models/users/user-dto';
import { SOCKET_EVENTS } from '../utils/socket-events';
import { broadcast, getUserRoom } from '../utils/socket-functions';
import { SocketUsersService } from './socket-users.service';

@Injectable()
export class RoomPingsService {
  constructor(private _socketUsersService: SocketUsersService) { }

  public onRoomPingRequest(socket: Socket, payload: RoomPing): void { 
    const requestUser: UserDto = this._socketUsersService.get(socket);

    if(requestUser != null) {
      payload.state = RoomPingState.Requesting;
      payload.requestUser = requestUser;
      
      if(!payload.requestDate) {
        payload.requestDate = new Date().toISOString();
      }

      const room: string = getUserRoom(requestUser);
      broadcast(socket, SOCKET_EVENTS.roomPingRequest, payload, room);
    }
  }

  public onRoomPingResponse(socket: Socket, payload: RoomPing): void { 
    const responseUser: UserDto = this._socketUsersService.get(socket);

    if(responseUser != null) {
      payload.state = RoomPingState.Responded;
      payload.responseUser = responseUser;

      const room: string = getUserRoom(responseUser);
      broadcast(socket, SOCKET_EVENTS.roomPingRequest, payload, room);
    }
  }
}
