import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { UsersService } from '../users/users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({})
  ],
  providers: [
    AuthService,
    UsersService,
    MapperService
  ],
  controllers: [AuthController]
})
export class AuthModule { }