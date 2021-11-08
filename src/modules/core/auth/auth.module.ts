import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserPasswordsService } from './user-passwords.service';
import { AuthController } from './auth.controller';
import { JwtAuthModule } from 'src/modules/shared/jwt-auth/jwt-auth.module';
import { UsersModule } from '../users/users.module';
import { MapperModule } from 'src/modules/shared/mapper/mapper.module';

@Module({
  imports: [
    JwtAuthModule,
    UsersModule,
    MapperModule
  ],
  providers: [
    AuthService,
    UserPasswordsService
  ],
  controllers: [AuthController]
})
export class AuthModule { }