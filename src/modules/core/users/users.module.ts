import { Module } from '@nestjs/common';
import { JwtAuthModule } from 'src/modules/shared/jwt-auth/jwt-auth.module';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [JwtAuthModule],
  exports: [UsersService],
  providers: [
    UsersService,
    MapperService
  ],
  controllers: [UsersController]
})
export class UsersModule { }