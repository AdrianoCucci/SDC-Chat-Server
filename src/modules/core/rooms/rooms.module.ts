import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { JwtAuthModule } from 'src/modules/shared/jwt-auth/jwt-auth.module';
import { MapperModule } from 'src/modules/shared/mapper/mapper.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { Room } from './entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room]),
    JwtAuthModule,
    MapperModule,
    OrganizationsModule
  ],
  providers: [RoomsService],
  controllers: [RoomsController]
})
export class RoomsModule { }