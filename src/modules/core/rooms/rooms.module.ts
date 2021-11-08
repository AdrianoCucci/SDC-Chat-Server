import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { JwtAuthModule } from 'src/modules/shared/jwt-auth/jwt-auth.module';
import { MapperModule } from 'src/modules/shared/mapper/mapper.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [
    JwtAuthModule,
    MapperModule,
    OrganizationsModule
  ],
  providers: [RoomsService],
  controllers: [RoomsController]
})
export class RoomsModule { }