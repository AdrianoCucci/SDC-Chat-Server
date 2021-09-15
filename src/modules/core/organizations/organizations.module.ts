import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { MapperService } from 'src/utils/dto-mappings/mapper.service';
import { JwtAuthModule } from 'src/modules/shared/jwt-auth/jwt-auth.module';

@Module({
  imports: [JwtAuthModule],
  providers: [
    OrganizationsService,
    MapperService
  ],
  controllers: [OrganizationsController]
})
export class OrganizationsModule { }