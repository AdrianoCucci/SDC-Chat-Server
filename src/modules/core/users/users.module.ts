import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthModule } from 'src/modules/shared/jwt-auth/jwt-auth.module';
import { UserSecretsModule } from '../user-secrets/user-secrets.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { MapperModule } from 'src/modules/shared/mapper/mapper.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtAuthModule,
    UserSecretsModule,
    OrganizationsModule,
    MapperModule
  ],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule { }