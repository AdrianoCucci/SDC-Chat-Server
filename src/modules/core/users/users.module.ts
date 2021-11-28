import { Module } from '@nestjs/common';
import { JwtAuthModule } from 'src/modules/shared/jwt-auth/jwt-auth.module';
import { UserSecretsModule } from '../user-secrets/user-secrets.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { MapperModule } from 'src/modules/shared/mapper/mapper.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    JwtAuthModule,
    UserSecretsModule,
    OrganizationsModule,
    MapperModule,
  ],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule { }