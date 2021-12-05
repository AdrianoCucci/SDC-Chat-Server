import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSecretsService } from './user-secrets.service';
import { UserSecret } from './entities/user-secret.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserSecret])],
  exports: [UserSecretsService],
  providers: [UserSecretsService]
})
export class UserSecretsModule { }