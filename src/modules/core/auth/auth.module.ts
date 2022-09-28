import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtAuthModule } from "src/modules/shared/jwt-auth/jwt-auth.module";
import { UsersModule } from "../users/users.module";
import { UserSecretsModule } from "../user-secrets/user-secrets.module";
import { MapperModule } from "src/modules/shared/mapper/mapper.module";

@Module({
  imports: [JwtAuthModule, UsersModule, UserSecretsModule, MapperModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
