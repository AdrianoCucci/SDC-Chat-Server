import { Module } from '@nestjs/common';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  exports: [UsersService],
  providers: [
    UsersService,
    MapperService
  ],
  controllers: [UsersController]
})
export class UsersModule { }