import { Module } from '@nestjs/common';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, MapperService]
})
export class UsersModule { }