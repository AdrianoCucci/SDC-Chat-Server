import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { JwtAuthModule } from 'src/modules/shared/jwt-auth/jwt-auth.module';
import { MapperModule } from 'src/modules/shared/mapper/mapper.module';

@Module({
  imports: [
    JwtAuthModule,
    MapperModule
  ],
  exports: [OrganizationsService],
  providers: [OrganizationsService],
  controllers: [OrganizationsController]
})
export class OrganizationsModule { }