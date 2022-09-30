import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { UserDto } from "../../users/dtos/user.dto";

@Injectable()
export class SocketUsersService {
  private readonly _socketUserMap = new Map<Socket, UserDto>();

  public get(socket: Socket): UserDto {
    return this._socketUserMap.get(socket);
  }

  public set(socket: Socket, user: UserDto): void {
    this._socketUserMap.set(socket, user);
  }

  public has(socket: Socket): boolean {
    return this._socketUserMap.has(socket);
  }

  public foreach(callback: (user: UserDto, socket: Socket) => void): void {
    this._socketUserMap.forEach(callback);
  }

  public delete(socket: Socket): boolean {
    return this._socketUserMap.delete(socket);
  }

  public clear(): void {
    this._socketUserMap.clear();
  }
}
