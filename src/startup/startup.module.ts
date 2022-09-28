import { Module } from "@nestjs/common";
import { ChatMessagesModule } from "src/modules/core/chat-messages/chat-messages.module";
import { UserSecretsModule } from "src/modules/core/user-secrets/user-secrets.module";
import { UsersModule } from "src/modules/core/users/users.module";
import { StartupService } from "./startup.service";

@Module({
  imports: [UsersModule, UserSecretsModule, ChatMessagesModule],
  providers: [StartupService],
})
export class StartupModule {}
