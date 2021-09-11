import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

const jwtRegisterModule: DynamicModule = JwtModule.register({});

@Module({
  imports: [jwtRegisterModule],
  exports: [jwtRegisterModule, AuthService],
  providers: [
    AuthService,
    JwtStrategy,
    UsersService,
    MapperService,
  ],
  controllers: [AuthController]
})
export class AuthModule { }