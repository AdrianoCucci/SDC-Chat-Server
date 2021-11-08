import { Module } from '@nestjs/common';
import { UserPasswordsService } from './user-passwords.service';

@Module({
  exports: [UserPasswordsService],
  providers: [UserPasswordsService]
})
export class UserPasswordsModule { }