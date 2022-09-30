import { Module } from "@nestjs/common";
import { ChatMessagesModule } from "../chat-messages/chat-messages.module";
import { UsersModule } from "../users/users.module";
import { MapperModule } from "src/modules/shared/mapper/mapper.module";
import { AppWebSocketGateway } from "./app-web-socket.gateway";
import { SocketUsersService } from "./services/socket-users.service";
import { LiveChatService } from "./services/live-chat.service";
import { RoomPingsService } from "./services/room-pings.service";

@Module({
  imports: [ChatMessagesModule, UsersModule, MapperModule],
  providers: [
    AppWebSocketGateway,
    SocketUsersService,
    LiveChatService,
    RoomPingsService,
  ],
})
export class AppWebSocketModule {}
