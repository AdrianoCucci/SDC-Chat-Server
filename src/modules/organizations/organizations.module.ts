import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { AuthModule } from '../auth/auth.module';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';

@Module({
  imports: [AuthModule],
  providers: [
    OrganizationsService,
    MapperService
  ],
  controllers: [OrganizationsController]
})
export class OrganizationsModule { }