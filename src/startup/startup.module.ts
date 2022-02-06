import { Module } from '@nestjs/common';
import { UserSecretsModule } from 'src/modules/core/user-secrets/user-secrets.module';
import { UsersModule } from 'src/modules/core/users/users.module';
import { StartupService } from './startup.service';

@Module({
  imports: [
    UsersModule,
    UserSecretsModule
  ],
  providers: [StartupService]
})
export class StartupModule { }