import { Socket } from "socket.io";
import { UserDto } from "../../users/dtos/user.dto";

export const getUserRoom = (user: UserDto): string | null => user.organizationId != null ? `Organization_Room_${user.organizationId}` : null;

export const broadcast = (socket: Socket, event: string, payload: any, room?: string) => {
  if(room) {
    socket.to(room).emit(event, payload);
  }
  else {
    socket.broadcast.emit(event, payload);
  }
}