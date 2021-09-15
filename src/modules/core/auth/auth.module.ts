import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { UsersModule } from '../users/users.module';
import { JwtAuthModule } from 'src/modules/shared/jwt-auth/jwt-auth.module';

@Module({
  imports: [
    JwtAuthModule,
    UsersModule
  ],
  providers: [
    AuthService,
    MapperService
  ],
  controllers: [AuthController]
})
export class AuthModule { }