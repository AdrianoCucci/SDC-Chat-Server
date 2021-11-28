import { Module } from '@nestjs/common';
import { UserSecretsService } from './user-secrets.service';

@Module({
  exports: [UserSecretsService],
  providers: [UserSecretsService]
})
export class UserSecretsModule { }