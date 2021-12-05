import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { JwtAuthModule } from 'src/modules/shared/jwt-auth/jwt-auth.module';
import { MapperModule } from 'src/modules/shared/mapper/mapper.module';
import { Organization } from './entities/organization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization]),
    JwtAuthModule,
    MapperModule
  ],
  exports: [OrganizationsService],
  providers: [OrganizationsService],
  controllers: [OrganizationsController]
})
export class OrganizationsModule { }