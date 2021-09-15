import { Module } from '@nestjs/common';
import { JwtAuthModule } from 'src/modules/shared/jwt-auth/jwt-auth.module';
import { MapperModule } from 'src/modules/shared/mapper/mapper.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    JwtAuthModule,
    MapperModule
  ],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule { }