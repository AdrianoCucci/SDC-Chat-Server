import { Module } from '@nestjs/common';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [AuthModule],
  providers: [
    UsersService,
    MapperService,
    JwtAuthGuard
  ],
  controllers: [UsersController]
})
export class UsersModule { }