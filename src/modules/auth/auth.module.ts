import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';

@Module({
  providers: [
    AuthService,
    UsersService,
    MapperService
  ],
  controllers: [AuthController]
})
export class AuthModule { }