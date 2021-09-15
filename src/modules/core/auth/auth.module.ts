import { DynamicModule, forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

const jwtRegisterModule: DynamicModule = JwtModule.register({});

@Module({
  imports: [
    jwtRegisterModule,
    UsersModule
  ],
  exports: [jwtRegisterModule],
  providers: [
    AuthService,
    MapperService
  ],
  controllers: [AuthController]
})
export class AuthModule { }